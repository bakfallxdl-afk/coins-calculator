#!/usr/bin/env python3
import asyncio
import websockets

async def handler(websocket, path):
    print("🎯 新客户端连接!")
    try:
        # 立即发送欢迎消息
        await websocket.send('{"type": "welcome", "msg": "连接成功"}')
        print("📤 已发送欢迎消息")
        
        # 等待客户端消息
        async for message in websocket:
            print(f"📩 收到客户端消息: {message}")
            # 回声
            await websocket.send(f'{{"echo": {message}}}')
            
    except websockets.exceptions.ConnectionClosed:
        print("🔌 连接正常关闭")
    except Exception as e:
        print(f"❌ 错误: {e}")
    finally:
        print("👋 客户端断开")

async def main():
    print("=" * 50)
    print("🚀 极简WebSocket服务器启动中...")
    print("📡 端口: 8765")
    print("=" * 50)
    
    async with websockets.serve(handler, "localhost", 8765):
        print("✅ 服务器已启动! 等待连接...")
        await asyncio.Future()  # 永远运行

if __name__ == "__main__":
    asyncio.run(main())
