import React, { useState, useEffect, createRef } from 'react';
import { Button, Tooltip, Space, Badge, Avatar } from 'antd';
import * as sdk from '@seatalk/web-app-sdk';
import { ImageObject } from '@seatalk/web-app-sdk/lib/types';

import './KitchenSink.css';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const KitchenSink: React.FC = () => {
  useEffect(() => {
    console.log('window.location.href:', window.location.href);
    console.log('sdk.clientInfo:', sdk.clientInfo);
  }, []);

  const [images, setImages] = useState<ImageObject[]>([]);

  const fetchImageButton = createRef<HTMLElement>();
  const [fetchingImages, setFetchingImages] = useState(false);
  useEffect(() => {
    (async () => {
      if (images.length && fetchingImages) {
        // Delay 300ms to allow the spinner on the button to show, as
        // fetchImage() is not truly asynchronous under the hood, it blocks
        // the JS main thread when executing.
        await new Promise((resolve) => setTimeout(resolve, 300));
        const start = Date.now();

        const files: Blob[] = [];
        for (const { url } of images) {
          const file = await new Promise<Blob>((resolve) => {
            sdk.fetchImage({
              url,
              onSuccess: resolve,
            });
          });
          files.push(file);
          console.log(`Blob (size: ${file.size}, type: ${file.type})`);
        }

        const diff = Date.now() - start;
        console.log(
          `It takes ${diff}ms to fetch ${files.length} image(s), ${Math.round(
            diff / files.length
          )}ms on average`
        );
        setFetchingImages(false);
      }
    })();
  }, [images, fetchingImages]);

  return (
    <div style={{ padding: 20 }}>
      <section>
        <p>
          <Button
            type="primary"
            onClick={() => {
              sdk.getSSOToken({
                onSuccess: (token: string) => {
                  console.log('SSO token:', token);
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
            setTimeout(() => {
              sdk.toast({ message: 'test (delayed 3s)' });
            }, 3000);
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
        <Tooltip
          placement="right"
          title={
            <span>
              Show 5 random images form{' '}
              <a href="https://picsum.photos">picsum.photos</a> (some of the
              images could be invalid), followed by 1 invalid image, and then 4
              animated gif images.
            </span>
          }
        >
          <Button
            type="primary"
            onClick={() => {
              sdk.showImages({
                urls: [
                  ...new Array(5).fill(0).map(() => {
                    const id = getRandomInt(1, 1000);
                    const width = getRandomInt(2, 7) * 100;
                    const height = getRandomInt(2, 7) * 100;
                    return `https://picsum.photos/id/${id}/${width}/${height}`;
                  }),
                  'https://google.com',
                  'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif',
                  'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif',
                  'https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif',
                  'https://media.giphy.com/media/C9x8gX02SnMIoAClXa/giphy.gif',
                ],
                selectedIndex: 4,
              });
            }}
          >
            showImages
          </Button>
        </Tooltip>
      </section>

      <section>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              sdk.pickImages({
                maxSelect: 30,
                onSuccess: (files: ImageObject[]) => {
                  setImages(
                    files.map((file) => {
                      console.log({
                        width: file.width,
                        height: file.height,
                        url: file.url,
                      });
                      return file;
                    })
                  );
                },
              });
            }}
          >
            pickImages
          </Button>
          {images.length > 0 && (
            <Button onClick={() => setImages([])}>Reset</Button>
          )}
        </Space>
        {images.length > 0 && (
          <div className="images">
            <Space size="middle" wrap>
              {images
                .map(({ url }) => url)
                .map((url, i, urls) => (
                  <span
                    key={url}
                    onClick={() => {
                      sdk.showImages({ urls, selectedIndex: i });
                    }}
                  >
                    <Badge count={i + 1}>
                      <Avatar shape="square" size={64} src={url} />
                    </Badge>
                  </span>
                ))}
            </Space>
          </div>
        )}
      </section>

      <section>
        <Space>
          <Button
            ref={fetchImageButton}
            type="primary"
            loading={fetchingImages}
            onClick={() => {
              if (!images.length) {
                sdk.toast({ message: 'Please pickImages first' });
                return;
              }
              setFetchingImages(true);
            }}
          >
            fetchImage
          </Button>
        </Space>
      </section>

      <section>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              sdk.shareAppLink({
                icon: 'logo192.png',
                onSuccess: () => sdk.toast({ message: 'onSuccess' }),
                onCancel: () => sdk.toast({ message: 'onCancel' }),
              });
            }}
          >
            shareAppLink
          </Button>
        </Space>
      </section>
    </div>
  );
};

export default KitchenSink;
