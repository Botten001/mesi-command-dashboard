import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const wsUrl = process.env.WS_TARGET_URL || 'http://187.77.64.102:3001';
    
    // Fetch status from backend (polling instead of WebSocket for now)
    const response = await fetch(`${wsUrl}/status`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch status');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Status fetch error:', error);
    return NextResponse.json(
      { status: 'idle', task: 'Connection error', timestamp: Date.now() },
      { status: 200 }
    );
  }
}
