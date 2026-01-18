#!/usr/bin/env python3
"""
Boss Assistant 实时同步服务器 - 最终修复版
"""
import asyncio
import websockets
import json
import logging
from typing import Dict, Set

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 存储连接和状态
room_connections: Dict[str, Set] = {}
room_timers: Dict[str, Dict] = {}

async def handle_timer_action(room_code: str, timer_id: str, action: str, data: dict, websocket):
    """处理并广播计时器操作"""
    if room_code not in room_timers:
        room_timers[room_code] = {}
    
    # 初始化或更新计时器状态
    if timer_id not in room_timers[room_code]:
        room_timers[room_code][timer_id] = {
            'remaining': data.get('duration', 60),
            'running': False,
            'completed': False
        }
    
    # 根据动作更新状态
    if action == 'start':
        room_timers[room_code][timer_id]['running'] = True
        room_timers[room_code][timer_id]['completed'] = False
    elif action == 'pause':
        room_timers[room_code][timer_id]['running'] = False
    elif action == 'reset':
        room_timers[room_code][timer_id] = {
            'remaining': data.get('duration', 60),
            'running': False,
            'completed': False
        }
    elif action == 'update':
        room_timers[room_code][timer_id]['remaining'] = data.get('remaining', 60)
    
    # 广播给房间内其他用户
    broadcast_msg = json.dumps({
        'type': 'timer_sync',
        'timerId': timer_id,
        'action': action,
        'data': room_timers[room_code][timer_id],
        'from': 'server'
    })
    
    if room_code in room_connections:
        tasks = []
        current_id = id(websocket)
        
        for conn in room_connections[room_code]:
            conn_id = id(conn)
            if conn != websocket:  # 关键修复：去掉 .open 检查
                try:
                    tasks.append(conn.send(broadcast_msg))
                    logger.debug(f"发送给客户端 {conn_id}")
                except Exception as e:
                    logger.warning(f"发送给客户端 {conn_id} 失败: {e}")
        
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)
    
    logger.info(f"房间 {room_code} - 计时器 {timer_id} {action}")

async def handler(websocket):
    """处理WebSocket连接"""
    client_id = id(websocket)
    logger.info(f"新客户端连接: {client_id}")
    
    try:
        async for message in websocket:
            data = json.loads(message)
            msg_type = data.get('type')
            
            if msg_type == 'join_room':
                room_code = data['roomCode']
                
                if room_code not in room_connections:
                    room_connections[room_code] = set()
                
                room_connections[room_code].add(websocket)
                logger.info(f"客户端 {client_id} 加入房间 {room_code}")
                logger.info(f"房间 {room_code} 现有 {len(room_connections[room_code])} 个客户端")
                
                # 发送加入确认
                await websocket.send(json.dumps({
                    'type': 'room_joined',
                    'roomCode': room_code,
                    'message': f'成功加入房间 {room_code}'
                }))
                
                # 同步现有计时器状态
                if room_code in room_timers:
                    for timer_id, timer_state in room_timers[room_code].items():
                        await websocket.send(json.dumps({
                            'type': 'timer_sync',
                            'timerId': timer_id,
                            'action': 'sync',
                            'data': timer_state,
                            'from': 'server'
                        }))
            
            elif msg_type == 'timer_action':
                room_code = data['roomCode']
                timer_id = data['timerId']
                action = data['action']
                
                logger.info(f"客户端 {client_id} 在房间 {room_code} 操作 {timer_id}: {action}")
                await handle_timer_action(room_code, timer_id, action, data.get('data', {}), websocket)
            
            elif msg_type == 'leave_room':
                room_code = data['roomCode']
                if room_code in room_connections:
                    room_connections[room_code].discard(websocket)
                    logger.info(f"客户端 {client_id} 离开房间 {room_code}")
                    
                    # 清理空房间
                    if not room_connections[room_code]:
                        del room_connections[room_code]
    
    except websockets.exceptions.ConnectionClosed:
        logger.info(f"客户端 {client_id} 连接关闭")
    except Exception as e:
        logger.error(f"客户端 {client_id} 错误: {e}")
    finally:
        # 清理断开连接
        for room_code, connections in list(room_connections.items()):
            if websocket in connections:
                connections.discard(websocket)
                logger.info(f"清理: 客户端 {client_id} 从房间 {room_code} 断开")
                
                if not connections:
                    del room_connections[room_code]
                    logger.info(f"清理: 删除空房间 {room_code}")

async def main():
    """启动本地测试服务器"""
    port = 8765
    server = await websockets.serve(handler, "localhost", port)
    
    print("=" * 50)
    print("✅ Boss Assistant 服务器启动成功! (最终修复版)")
    print(f"📡 WebSocket 地址: ws://localhost:{port}")
    print(f"🌐 前端访问地址: http://localhost:8000")
    print("=" * 50)
    print("\n🎯 修复内容:")
    print("1. 移除了 conn.open 检查 (websockets 15.x兼容)")
    print("2. 增加了异常处理")
    print("3. 改进了房间清理逻辑")
    print("=" * 50)
    
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
