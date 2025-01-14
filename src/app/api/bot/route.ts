import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

let botProcess: any = null

export async function POST(req: Request) {
  try {
    const { action } = await req.json()

    if (action === 'start') {
      if (!botProcess) {
        botProcess = await execAsync('npm run server:dev', { 
          cwd: process.cwd(),
          windowsHide: true
        })
        return NextResponse.json({ status: 'started' })
      }
      return NextResponse.json({ status: 'already_running' })
    }

    if (action === 'stop') {
      if (botProcess) {
        process.kill(-botProcess.pid)
        botProcess = null
        return NextResponse.json({ status: 'stopped' })
      }
      return NextResponse.json({ status: 'not_running' })
    }

    if (action === 'status') {
      return NextResponse.json({ 
        status: botProcess ? 'running' : 'stopped'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Bot control error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
