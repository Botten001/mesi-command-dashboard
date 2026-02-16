'use client';

import { useState, useEffect } from 'react';

interface ShortScript {
  hook: { text: string; duration: string };
  content: { text: string; duration: string };
  cta: { text: string; duration: string };
  hashtags: string[];
}

interface CalendarVideo {
  day: number;
  date: string;
  topic: string;
  script: ShortScript;
  status: 'planned' | 'posted';
}

export default function ContentCreationPage() {
  const [calendar, setCalendar] = useState<CalendarVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatedScript, setGeneratedScript] = useState<ShortScript | null>(null);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    // Load calendar from local storage or API
    const loadCalendar = async () => {
      try {
        // For now, show sample data
        setCalendar([
          {
            day: 1,
            date: '2026-02-16',
            topic: 'ChatGPT hidden features',
            script: {
              hook: { text: 'Stop doing ChatGPT hidden features manually', duration: '0:00-0:05' },
              content: { text: 'Most people don\'t know that ChatGPT can generate code. Just type: "Generate a function for my app". That\'s it.', duration: '0:05-0:50' },
              cta: { text: 'Follow for more AI secrets they don\'t want you to know', duration: '0:50-1:00' },
              hashtags: ['#AI', '#ChatGPT', '#Productivity', '#Automation', '#TechTips'],
            },
            status: 'planned',
          },
          {
            day: 2,
            date: '2026-02-17',
            topic: 'AI productivity hacks',
            script: {
              hook: { text: 'This AI productivity hacks trick saves me 5 hours daily', duration: '0:00-0:05' },
              content: { text: 'Here\'s the secret: Claude has a hidden mode. Open settings, type "/imagine", and watch it work like magic.', duration: '0:05-0:50' },
              cta: { text: 'Save this before it gets removed', duration: '0:50-1:00' },
              hashtags: ['#AI', '#Productivity', '#Claude', '#Hacks', '#Tech'],
            },
            status: 'planned',
          },
        ]);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    loadCalendar();
  }, []);

  const generateScript = () => {
    const topics = ['ChatGPT', 'Midjourney', 'Claude', 'Zapier', 'Notion AI', 'ElevenLabs'];
    const actions = ['generate code', 'create images', 'automate tasks', 'write content', 'clone voices'];
    
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    
    setGeneratedScript({
      hook: { text: `This ${randomTopic} trick broke the internet`, duration: '0:00-0:05' },
      content: { text: `Most people don't know that ${randomTopic} can ${randomAction}. Just type: "${randomAction} for my business". That's it.`, duration: '0:05-0:50' },
      cta: { text: 'Follow if this saved you time today', duration: '0:50-1:00' },
      hashtags: ['#AI', `#${randomTopic.replace(/\s/g, '')}`, '#Productivity', '#Automation', '#TechTips'],
    });
  };

  const nextVideo = calendar.find(v => v.status === 'planned');
  const postedCount = calendar.filter(v => v.status === 'posted').length;

  return (
    <div className="h-full flex flex-col rounded-xl border border-white/10 bg-zinc-950/40 backdrop-blur-sm p-4 sm:p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Content Creation</h2>
          <p className="text-xs text-zinc-400">YouTube Shorts automation</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-emerald-400">{postedCount} posted</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400">{calendar.length} total</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-zinc-900/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-emerald-400">0</div>
            <div className="text-[10px] text-zinc-500">Posted</div>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-amber-400">30</div>
            <div className="text-[10px] text-zinc-500">Planned</div>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-400">AI</div>
            <div className="text-[10px] text-zinc-500">Niche</div>
          </div>
        </div>

        {/* Next Video */}
        {nextVideo && (
          <div className="bg-zinc-900/50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-zinc-300">🎬 Next Video</h3>
              <span className="text-[10px] text-zinc-500">Day {nextVideo.day}</span>
            </div>
            <p className="text-xs text-zinc-400 mb-2">{nextVideo.topic}</p>
            <div className="text-[10px] text-zinc-500 bg-zinc-950/50 rounded p-2 line-clamp-2">
              {nextVideo.script.hook.text}
            </div>
          </div>
        )}

        {/* Script Generator */}
        <div className="bg-zinc-900/50 rounded-lg p-3 sm:p-4">
          <h3 className="text-xs font-medium text-zinc-300 mb-3">⚡ Quick Script Generator</h3>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic (optional)"
              className="flex-1 px-2 sm:px-3 py-2 bg-zinc-950 border border-white/10 rounded text-xs text-zinc-100 focus:outline-none focus:border-emerald-500/50"
            />
            <button
              onClick={generateScript}
              className="px-3 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded text-xs font-medium hover:bg-emerald-500/30 transition-colors"
            >
              Generate
            </button>
          </div>

          {generatedScript && (
            <div className="space-y-2 bg-zinc-950/50 rounded p-3">
              <div>
                <span className="text-[10px] text-amber-400">HOOK:</span>
                <p className="text-xs text-zinc-300">{generatedScript.hook.text}</p>
              </div>
              <div>
                <span className="text-[10px] text-blue-400">CONTENT:</span>
                <p className="text-xs text-zinc-300 line-clamp-2">{generatedScript.content.text}</p>
              </div>
              <div>
                <span className="text-[10px] text-emerald-400">CTA:</span>
                <p className="text-xs text-zinc-300">{generatedScript.cta.text}</p>
              </div>
              <p className="text-[10px] text-zinc-500">{generatedScript.hashtags.join(' ')}</p>
            </div>
          )}
        </div>

        {/* Recent Scripts */}
        <div className="bg-zinc-900/50 rounded-lg p-3 sm:p-4">
          <h3 className="text-xs font-medium text-zinc-300 mb-3">📋 Upcoming Scripts</h3>
          <div className="space-y-2">
            {calendar.slice(0, 3).map((video) => (
              <div key={video.day} className="flex items-center gap-2 text-xs">
                <span className={`w-2 h-2 rounded-full ${video.status === 'posted' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                <span className="text-zinc-500 w-6">{video.day}</span>
                <span className="text-zinc-400 truncate flex-1">{video.topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button className="flex items-center justify-center gap-2 py-2 sm:py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/20 transition-colors">
            <span>📺</span>
            <span>YouTube Studio</span>
          </button>
          <button className="flex items-center justify-center gap-2 py-2 sm:py-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/20 transition-colors">
            <span>📄</span>
            <span>Full Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
