import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const vercelToken = process.env.VERCEL_TOKEN;
    
    if (!vercelToken) {
      return NextResponse.json({ 
        deployments: [],
        error: 'Vercel token not configured' 
      });
    }

    // Fetch recent deployments from Vercel
    const response = await fetch(
      'https://api.vercel.com/v6/deployments?limit=10',
      {
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch deployments');
    }

    const data = await response.json();
    
    const deployments = data.deployments?.map((d: any) => ({
      id: d.uid,
      name: d.name,
      url: d.url,
      state: d.state,
      createdAt: d.created,
      branch: d.meta?.githubCommitRef || 'main',
      commit: d.meta?.githubCommitMessage?.slice(0, 50) || 'No message',
      commitSha: d.meta?.githubCommitSha?.slice(0, 7) || '',
      creator: d.creator?.username || 'Unknown'
    })) || [];

    return NextResponse.json({ deployments });
  } catch (error) {
    console.error('Build queue error:', error);
    return NextResponse.json({ 
      deployments: [],
      error: 'Failed to load deployments' 
    });
  }
}
