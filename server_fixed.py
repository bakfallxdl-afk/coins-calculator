#!/usr/bin/env python3
"""
Boss Assistant 实时同步服务器 - 修复版（支持websockets 15.x）
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
        for conn in room_connections[room_code]:
            if conn != websocket and conn.open:
                tasks.append(conn.send(broadcast_msg))
        if tasks:
            await asyncio.gather(*tasks)
    
    logger.info(f"房间 {room_code} - 计时器 {timer_id} {action}，广播给 {len(tasks) if tasks else 0} 个客户端")

async def handler(websocket):  # 注意：只有1个参数，不是2个
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
    
    except Exception as e:
        logger.error(f"客户端 {client_id} 错误: {e}")
    finally:
        # 清理断开连接
        for room_code, connections in room_connections.items():
            if websocket in connections:
                connections.remove(websocket)
                logger.info(f"客户端 {client_id} 从房间 {room_code} 断开")

async def main():
    """启动本地测试服务器"""
    port = 8765
    server = await websockets.serve(handler, "localhost", port)
    
    print("=" * 50)
    print("✅ Boss Assistant 本地测试服务器启动成功! (修复版)")
    print(f"📡 WebSocket 地址: ws://localhost:{port}")
    print(f"🌐 前端访问地址: http://localhost:8000")
    print("=" * 50)
    print("\n📋 测试步骤:")
    print("1. 浏览器访问: http://localhost:8000")
    print("2. 创建/加入房间")
    print("3. 打开两个标签页测试同步")
    print("=" * 50)
    
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
