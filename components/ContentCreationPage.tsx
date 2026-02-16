'use client';

import { useState } from 'react';

interface VideoIdea {
  id: string;
  title: string;
  concept: string;
  thumbnail: string;
}

export default function ContentCreationPage() {
  const [day, setDay] = useState('1');
  const [whatHappened, setWhatHappened] = useState('');
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);

  const generateIdeas = () => {
    const templates = [
      { title: `I Survived ${day} Days in Hardcore Minecraft...`, concept: 'Classic survival milestone' },
      { title: `Hardcore Minecraft Day ${day}: ${whatHappened || 'Close Call'}`, concept: 'Event-focused episode' },
      { title: `I ${whatHappened || 'Went Mining'} in Hardcore Minecraft and Almost Died`, concept: 'Action-focused' },
      { title: `Building ${whatHappened || 'My Base'} in Hardcore Minecraft (Day ${day})`, concept: 'Building episode' },
    ];
    
    const generated = templates.map((t, i) => ({
      id: String(i),
      title: t.title,
      concept: t.concept,
      thumbnail: whatHappened 
        ? `Shocked face + "${whatHappened}" text`
        : `Day counter big + character in action pose`
    }));
    
    setIdeas(generated);
  };

  return (
    <div className="h-full flex flex-col rounded-xl border border-white/10 bg-zinc-950/40 backdrop-blur-sm p-4 sm:p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Content Creation</h2>
          <p className="text-xs text-zinc-400">Hardcore Minecraft YouTube channel</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="bg-zinc-900/50 rounded-lg p-3 text-center">
            <div className="text-lg sm:text-xl font-bold text-emerald-400">0</div>
            <div className="text-[10px] sm:text-xs text-zinc-500">Videos</div>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-3 text-center">
            <div className="text-lg sm:text-xl font-bold text-zinc-300">0</div>
            <div className="text-[10px] sm:text-xs text-zinc-500">Subscribers</div>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-3 text-center">
            <div className="text-lg sm:text-xl font-bold text-zinc-300">0</div>
            <div className="text-[10px] sm:text-xs text-zinc-500">Views</div>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-3 text-center">
            <div className="text-lg sm:text-xl font-bold text-amber-400">Day 0</div>
            <div className="text-[10px] sm:text-xs text-zinc-500">Current</div>
          </div>
        </div>

        {/* Title Generator */}
        <div className="bg-zinc-900/50 rounded-lg p-3 sm:p-4">
          <h3 className="text-xs font-medium text-zinc-300 mb-3">🎬 Title Generator</h3>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
            <div>
              <label className="text-[10px] sm:text-xs text-zinc-500 block mb-1">Day Number</label>
              <input
                type="number"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 bg-zinc-950 border border-white/10 rounded text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50"
                placeholder="15"
              />
            </div>
            <div>
              <label className="text-[10px] sm:text-xs text-zinc-500 block mb-1">What Happened?</label>
              <input
                type="text"
                value={whatHappened}
                onChange={(e) => setWhatHappened(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 bg-zinc-950 border border-white/10 rounded text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50"
                placeholder="found diamonds"
              />
            </div>
          </div>
          
          <button
            onClick={generateIdeas}
            className="w-full py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded text-xs sm:text-sm font-medium hover:bg-emerald-500/30 transition-colors"
          >
            Generate Ideas
          </button>

          {ideas.length > 0 && (
            <div className="mt-3 space-y-2">
              {ideas.map((idea) => (
                <div key={idea.id} className="bg-zinc-950/50 rounded p-2 sm:p-3 border border-white/5">
                  <div className="text-xs sm:text-sm text-zinc-200 font-medium mb-1">{idea.title}</div>
                  <div className="text-[10px] sm:text-xs text-zinc-500">{idea.concept}</div>
                  <div className="text-[10px] text-zinc-600 mt-1">🎨 {idea.thumbnail}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Episode Checklist */}
        <div className="bg-zinc-900/50 rounded-lg p-3 sm:p-4">
          <h3 className="text-xs font-medium text-zinc-300 mb-3">✅ Episode Checklist</h3>
          <div className="space-y-2">
            {[
              'Hook intro (30s cliffhanger)',
              'Recap previous episode',
              'Main content (mining/building/exploring)',
              'Close call or highlight moment',
              'Outro with next episode teaser',
            ].map((item, i) => (
              <label key={i} className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer hover:text-zinc-300">
                <input type="checkbox" className="rounded bg-zinc-950 border-white/20" />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <a
            href="https://youtube.com/upload"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2 sm:py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-500/20 transition-colors"
          >
            <span>📺</span>
            <span>YouTube Studio</span>
          </a>
          <a
            href="https://docs.google.com/document/d/1dummy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2 sm:py-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-500/20 transition-colors"
          >
            <span>📄</span>
            <span>Full Plan</span>
          </a>
        </div>
      </div>
    </div>
  );
}
