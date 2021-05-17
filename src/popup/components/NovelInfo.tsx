import React, { useCallback, useEffect, useState } from 'react';
import { Result, Spin, Progress } from 'antd';
import { throttle } from 'lodash-es';
import { ReloadOutlined } from '@ant-design/icons';
import { Downloader, DownloadStatus, HanlerCallback } from '@/background/downloader';
import WebList from './WebList';
import rules, { Novel } from '../../rules';
import { getHostName } from '../../utils';
import './NovelInfo.scss';

const bgWindow = chrome.extension.getBackgroundPage();
const bgApp = (bgWindow as Window).app;

enum PageStatus {
  support = 'support',
  notSupport = 'not support',
  notCurrentPage = 'not correct page'
}

// 获取当前页面的状态
const getPageStatus = (url: string) => {
  const hostname = getHostName(url);
  const rule = rules[hostname];
  if (rule) {
    if (rule.regExp.test(url)) {
      return PageStatus.support;
    }
    return PageStatus.notCurrentPage;
  }
  return PageStatus.notSupport;
};

const NovelInfo: React.FunctionComponent = () => {
  const [mainUrl, setMainUrl] = useState('');
  const [status, setStatus] = useState<PageStatus>(PageStatus.notSupport);
  const [info, setInfo] = useState<Novel>({
    chapters: []
  });
  const [loading, setLoading] = useState(false);
  const [downloaderStatus, setDownloaderStatus] = useState<DownloadStatus>(DownloadStatus.notStart);
  const [percent, setPercent] = useState(0);

  // 获取小说数据
  const getInfo = (url?: string) => {
    if (!url) return;
    setLoading(true);
    Downloader.getPageInfo(url).then(novel => {
      setInfo(novel);
      setLoading(false);
    });
  };

  const handleChange: HanlerCallback = throttle((novel, status, chapterLen) => {
    setDownloaderStatus(status);
    setInfo(novel);
    const per = Math.floor((chapterLen / novel.chapters.length) * 100);
    setPercent(per);
    if (status === DownloadStatus.success) {
      setDownloaderStatus(DownloadStatus.notStart);
      setPercent(0);
    }
  }, 500);

  const startDownload = useCallback(() => {
    const downloader = bgApp.stack.push(mainUrl);
    downloader.onChange(handleChange);
  }, [handleChange, mainUrl]);

  const getDownloadStatus = (mainUrl: string) => {
    const downloader = bgApp.stack.get(mainUrl);
    if (downloader) {
      handleChange(downloader.novel, downloader.status, downloader.chapterLen);
      downloader.onChange(handleChange);
      return true;
    }
    return false;
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
      if (tabs && tabs.length > 0) {
        const tab = tabs[0];
        setMainUrl(tab.url || '');
        const pageStatus = getPageStatus(tab.url || '');
        setStatus(pageStatus);
        if (pageStatus === PageStatus.support) {
          if (getDownloadStatus(tab.url || '')) {
            return;
          }
          getInfo(tab.url);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='novel-wrap'>
      {status === PageStatus.notSupport && <Result status='error' title='当前网站不支持下载' extra={<WebList />} />}
      {status === PageStatus.notCurrentPage && (
        <Result status='warning' title='不在小说主页' subTitle='当前网站小说支持下载，请进入小说主页' />
      )}
      {status === PageStatus.support && (
        <Spin spinning={loading}>
          <div className='info'>
            <div className='info-wrap'>
              <div className='cover-img'>
                <img src={info.coverImgUrl || '/noCover.jpeg'} alt='cover' />
              </div>
              <div className='content'>
                <h1>{info.title}</h1>
                <span>{info.author}</span>
                <span>{info.category}</span>
                <span>{info.updateTime}</span>
              </div>
            </div>
            <p className='description'>{info.description}</p>
            <div className='chapter-info'>
              <span className='chapter-len'>{info.chapters.length} 章</span>
              {downloaderStatus === DownloadStatus.notStart && <a onClick={startDownload}>下载</a>}
              {(downloaderStatus === DownloadStatus.downloading || downloaderStatus === DownloadStatus.error) && (
                <Progress
                  className='percent'
                  percent={percent}
                  status={downloaderStatus === DownloadStatus.error ? 'exception' : 'active'}
                />
              )}
              {(downloaderStatus === DownloadStatus.error) && <ReloadOutlined className='refresh-icon' onClick={startDownload} />}
              {downloaderStatus === DownloadStatus.generating && <span>生成中...</span>}
            </div>
          </div>
        </Spin>
      )}
    </div>
  );
};

export default NovelInfo;
