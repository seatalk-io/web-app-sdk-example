import React, { useEffect } from 'react';
import { Button } from 'antd';
import * as sdk from '@seatalk/web-app-sdk';

import './KitchenSink.css';

const KitchenSink: React.FC = () => {
  useEffect(() => {
    console.log('window.location.href:', window.location.href);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <section>
        <p>
          <Button
            type="primary"
            onClick={() => {
              sdk.getSSOToken({
                onSuccess: (token) => {
                  console.log(token);
                },
              });
            }}
          >
            getSSOToken
          </Button>
        </p>
      </section>
      <section>
        <Button
          type="primary"
          onClick={() => {
            sdk.toast({ message: 'test' });
          }}
        >
          toast
        </Button>
      </section>
      <section>
        <Button
          type="primary"
          onClick={() => {
            sdk.showDialog({
              title: 'Dialog Title',
              message: 'Dialog message',
              okText: 'Ok',
              cancelText: 'Cancel',
              onOk: () => {
                sdk.toast({ message: 'onOk' });
              },
              onCancel: () => {
                sdk.toast({ message: 'onCancel' });
              },
            });
          }}
        >
          showDialog
        </Button>
      </section>
      <section>
        <Button
          type="primary"
          onClick={() => {
            sdk.showImages({
              urls: new Array(5)
                .fill(0)
                .map((_, i) => `https://picsum.photos/600?id=${i}`),
              selectedIndex: 5,
            });
          }}
        >
          showImages
        </Button>
      </section>
    </div>
  );
};

export default KitchenSink;
