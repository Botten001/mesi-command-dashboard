import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { action } = await request.json();
    const baseUrl = process.env.WS_TARGET_URL || 'http://187.77.64.102:3001';

    switch (action) {
      case 'restart-status-server':
        // This would need to be handled by the container
        return NextResponse.json({ 
          success: false, 
          message: 'Restart via SSH: docker exec openclaw-blau-openclaw-1 pkill -f ws_server.js && docker exec -d openclaw-blau-openclaw-1 bash -c "cd /data/.openclaw/workspace && node scripts/ws_server.js > /tmp/ws_server.log 2>&1 &"'
        });

      case 'sync-drive':
        return NextResponse.json({ 
          success: false,
          message: 'Run in container: cd /data/.openclaw/workspace && ./scripts/sync_to_drive.py'
        });

      case 'call-test':
        return NextResponse.json({ 
          success: false,
          message: 'Run: curl -X POST https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Calls.json ...'
        });

      case 'update-status':
        const { status, task } = await request.json();
        const res = await fetch(`${baseUrl}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, task })
        });
        return NextResponse.json({ success: res.ok });

      default:
        return NextResponse.json({ success: false, message: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
