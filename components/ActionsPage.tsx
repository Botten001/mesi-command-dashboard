'use client';

import { useState } from 'react';

interface ActionButton {
  id: string;
  label: string;
  description: string;
  icon: string;
  command: string;
}

const actions: ActionButton[] = [
  {
    id: 'restart-server',
    label: 'Restart Status Server',
    description: 'Restart the WebSocket/HTTP status server if it crashes',
    icon: '🔄',
    command: 'docker exec openclaw-blau-openclaw-1 pkill -f ws_server.js && docker exec -d openclaw-blau-openclaw-1 bash -c "cd /data/.openclaw/workspace && node scripts/ws_server.js > /tmp/ws_server.log 2>&1 &"'
  },
  {
    id: 'sync-drive',
    label: 'Sync to Google Drive',
    description: 'Backup workspace files to Drive',
    icon: '☁️',
    command: 'docker exec -it openclaw-blau-openclaw-1 bash -c "cd /data/.openclaw/workspace && ./scripts/sync_to_drive.py"'
  },
  {
    id: 'call-test',
    label: 'Test Phone Call',
    description: 'Call your number to test Twilio',
    icon: '📞',
    command: 'curl -X POST https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Calls.json --data-urlencode "To=+4522784979" --data-urlencode "From=+4552513023" --data-urlencode "Url=https://twimlets.com/message?Message%5B0%5D=Test%20call" -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN"'
  },
  {
    id: 'redeploy',
    label: 'Redeploy Dashboard',
    description: 'Trigger Vercel redeploy',
    icon: '🚀',
    command: 'cd /data/.openclaw/workspace/mesi-command-dashboard && git commit --allow-empty -m "Trigger redeploy" && git push origin master'
  },
  {
    id: 'add-task',
    label: 'Add Task',
    description: 'Add a new task to the board',
    icon: '➕',
    command: './scripts/tasks.py add todo "task-id" "Task description here"'
  },
  {
    id: 'update-status',
    label: 'Update Agent Status',
    description: 'Set my current status and task',
    icon: '🤖',
    command: './scripts/update_status.py "Task description" active|idle'
  }
];

export default function ActionsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCommand = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="h-full flex flex-col rounded-xl border border-white/10 bg-zinc-950/40 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Actions</h2>
          <p className="text-xs text-zinc-400">Quick commands and shortcuts</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action) => (
            <div
              key={action.id}
              className="group rounded-lg border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer"
              onClick={() => copyCommand(action.command, action.id)}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{action.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-zinc-200 group-hover:text-white">
                    {action.label}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">{action.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <code className="text-[10px] bg-black/30 text-zinc-400 px-2 py-1 rounded truncate flex-1 font-mono">
                      {action.command.slice(0, 50)}...
                    </code>
                    <span className={`text-[10px] px-2 py-1 rounded ${
                      copied === action.id 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {copied === action.id ? 'Copied!' : 'Copy'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
          <p className="text-xs text-amber-200">
            <strong>Note:</strong> These commands need to be run on your VPS. Click any card to copy the command to clipboard, then paste in your terminal.
          </p>
        </div>
      </div>
    </div>
  );
}
