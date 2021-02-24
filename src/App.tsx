import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Space, Switch } from 'antd';
import { Console, Hook, Unhook } from 'console-feed';
import { HookedConsole, Message } from 'console-feed/lib/definitions/Console';
import { Message as ComponentMessage } from 'console-feed/lib/definitions/Component';

import './App.css';

const KitchenSink = React.lazy(() => import('./KitchenSink'));

const App: React.FC = () => {
  const [showConsole, setShowConsole] = useState(false);
  const [logs, setLogs] = useState<Message[]>([]);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Hook(
      window.console,
      (log) => setLogs((currLogs) => [...currLogs, log]),
      false
    );
    return () => {
      Unhook(window.console as HookedConsole);
    };
  }, []);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
    if (logs.length) {
      setShowConsole(true);
    }
  }, [logs]);

  return (
    <>
      <div className="controls">
        <Space>
          Show Console
          <Switch checked={showConsole} onChange={setShowConsole} />
        </Space>
      </div>
      <Suspense fallback={<pre>loading...</pre>}>
        <KitchenSink />
      </Suspense>
      <div
        ref={consoleRef}
        className="console"
        style={{ display: showConsole ? 'block' : 'none' }}
      >
        <Console
          styles={{
            BASE_FONT_FAMILY: `source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace`,
          }}
          variant="dark"
          logs={logs as ComponentMessage[]}
        />
      </div>
    </>
  );
};

export default App;
