import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const upgradeHeader = request.headers.get('upgrade');
  
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected WebSocket upgrade', { status: 426 });
  }

  const wsUrl = process.env.WS_TARGET_URL || 'ws://187.77.64.102:3001';
  
  try {
    // Proxy WebSocket connection to backend
    const response = await fetch(wsUrl, {
      headers: {
        'Upgrade': 'websocket',
        'Connection': 'Upgrade',
      },
    });

    return response;
  } catch (error) {
    console.error('WebSocket proxy error:', error);
    return new Response('Failed to connect to WebSocket server', { status: 502 });
  }
}
