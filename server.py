#!/usr/bin/env python3
"""
简化版测试服务器
"""
import asyncio
import websockets
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def handler(websocket, path):
    """简化处理函数"""
    client_id = id(websocket)
    logger.info(f"新客户端连接: {client_id}")
    
    try:
        await websocket.send(json.dumps({
            'type': 'welcome',
            'message': 'Connected to server'
        }))
        
        async for message in websocket:
            try:
                data = json.loads(message)
                msg_type = data.get('type')
                
                logger.info(f"收到消息: {msg_type}")
                
                if msg_type == 'join_room':
                    room_code = data.get('roomCode', 'TEST')
                    
                    # 简单回应
                    response = {
                        'type': 'room_joined',
                        'roomCode': room_code,
                        'message': f'Joined room {room_code}'
                    }
                    
                    await websocket.send(json.dumps(response))
                    logger.info(f"客户端 {client_id} 加入房间 {room_code}")
                    
                elif msg_type == 'test':
                    await websocket.send(json.dumps({
                        'type': 'test_response',
                        'message': 'Test successful'
                    }))
                    
                else:
                    await websocket.send(json.dumps({
                        'type': 'error',
                        'message': f'Unknown type: {msg_type}'
                    }))
                    
            except Exception as e:
                logger.error(f"处理错误: {e}")
                await websocket.send(json.dumps({
                    'type': 'error',
                    'message': str(e)
                }))
                
    except Exception as e:
        logger.error(f"连接错误: {e}")
    finally:
        logger.info(f"客户端 {client_id} 断开")

async def main():
    port = 8765
    server = await websockets.serve(handler, "localhost", port)
    
    print("=" * 50)
    print("✅ 简化测试服务器启动成功!")
    print(f"📡 WebSocket 地址: ws://localhost:{port}")
    print("=" * 50)
    print("\n测试步骤:")
    print("1. 在浏览器控制台运行测试代码")
    print("2. 应该看到 'room_joined' 响应")
    print("=" * 50)
    
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())