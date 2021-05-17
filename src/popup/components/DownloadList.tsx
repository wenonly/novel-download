import React, { useState, useEffect } from 'react';
import { Image, List, Progress } from 'antd';
import './DownloadList.scss';
import { Downloader, DownloadStatus } from '@/background/downloader';
import { ReloadOutlined } from '@ant-design/icons';

const bgWindow = chrome.extension.getBackgroundPage();
const bgApp = (bgWindow as Window).app;

interface DownloadItem {
  mainUrl?: string;
  title?: string;
  cover?: string;
  status?: DownloadStatus;
  progress: number;
  description?: string;
  chapterLength: number; // 章节长度
}

const DownloadList: React.FunctionComponent = () => {
  const [data, setData] = useState<DownloadItem[]>([]);

  const handleStackToData = (stackList: { [url: string]: Downloader }) => {
    const data: DownloadItem[] = [];
    for (const key of Object.keys(stackList)) {
      const downloader = stackList[key];
      data.push({
        mainUrl: downloader.mainUrl,
        title: downloader.novel.title,
        cover: downloader.novel.coverImgUrl,
        progress: Math.floor((downloader.chapterLen / downloader.novel.chapters.length) * 100),
        description: downloader.novel.description,
        chapterLength: downloader.novel.chapters.length,
        status: downloader.status
      });
    }
    setData(data);
  };

  const openPage = (url?: string) => {
    chrome.tabs.create({ url });
  };

  const restart = (mainUrl?: string) => {
    if (mainUrl) {
      bgApp.stack.push(mainUrl);
    }
  };

  useEffect(() => {
    const { stack } = bgApp;
    handleStackToData(stack.getAll());
    stack.onChange(stackList => {
      handleStackToData(stackList);
    });
  }, []);

  return (
    <div className='download-wrap'>
      <List
        itemLayout='horizontal'
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Image src={item.cover} width={70} height={95} />}
              title={
                <div className='item-header'>
                  <a onClick={() => openPage(item.mainUrl)}>{item.title}</a>
                  <span>{item.chapterLength} 章</span>
                </div>
              }
              description={
                <div className='desc-wrap'>
                  <span className='desc'>{item.description}</span>
                  <div className='action'>
                    {item.status === DownloadStatus.generating ? (
                      <div className='status'>生成中...</div>
                    ) : (
                      <Progress
                        className='percent'
                        percent={item.progress}
                        status={item.status === DownloadStatus.error ? 'exception' : 'active'}
                      />
                    )}
                    {item.status === DownloadStatus.error && (
                      <ReloadOutlined className='refresh-icon' onClick={() => restart(item.mainUrl)} />
                    )}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default DownloadList;
