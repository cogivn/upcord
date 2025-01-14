import { NextResponse } from 'next/server'

const BOT_SERVER_URL = process.env.BOT_SERVER_URL

export async function POST(req: Request) {
  try {
    const { action } = await req.json()

    if (action === 'start') {
      const response = await fetch(`${BOT_SERVER_URL}/bot/start`, {
        method: 'POST',
      });

      const data = await response.json();
      if (!response.ok) {
        return NextResponse.json({ error: data.error }, { status: response.status });
      }

      return NextResponse.json(data);
    }

    if (action === 'stop') {
      const response = await fetch(`${BOT_SERVER_URL}/bot/stop`, {
        method: 'POST',
      });

      const data = await response.json();
      if (!response.ok) {
        return NextResponse.json({ error: data.error }, { status: response.status });
      }

      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error in bot API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const response = await fetch(`${BOT_SERVER_URL}/bot/status`);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in bot status API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Đã xóa mã liên quan đến next-auth
