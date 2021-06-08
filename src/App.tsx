import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Button, Space, Divider, Switch } from 'antd';
import { Console, Hook, Unhook } from 'console-feed';
import { Message } from 'console-feed/lib/definitions/Console';
import { Resizable } from 're-resizable';

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
      // @ts-ignore
      Unhook(window.console);
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
      <div
        style={{ minHeight: showConsole ? 'max(70%, 100% - 300px)' : '100%' }}
      >
        <div className="controls">
          <Space size="small">
            <Space>
              Show console
              <Switch checked={showConsole} onChange={setShowConsole} />
            </Space>
            <Divider type="vertical" />
            <Button
              size="small"
              onClick={() => {
                // @ts-ignore
                setLogs([]);
              }}
            >
              Clear console
            </Button>
          </Space>
        </div>
        <Suspense fallback={null}>
          <KitchenSink />
        </Suspense>
      </div>
      <Resizable
        enable={{
          top: true,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        bounds="parent"
        boundsByDirection
        defaultSize={{ width: '100%', height: '30%' }}
        minWidth="100%"
        minHeight="30%"
        style={{ display: showConsole ? 'block' : 'none' }}
        className="console"
      >
        <div ref={consoleRef} className="console-inner">
          <Console
            styles={{
              BASE_FONT_FAMILY: `source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace`,
            }}
            variant="dark"
            // @ts-ignore
            logs={logs.filter((log) => {
              return !(
                log.method === 'debug' &&
                log.data?.[0] === '[@seatalk/web-app-sdk]' &&
                log.data?.[1] === '[BridgeWebview]'
              );
            })}
          />
        </div>
      </Resizable>
    </>
  );
};

export default App;
