import React, { useEffect, useState } from 'react';
import { Result, Spin } from 'antd';
import { Downloader } from '@/background/downloader';
import request from '../request';
import WebList from './WebList';
import rules, {Novel, Rule} from '../rules';
import { getHostName } from '../utils';

const bgWindow = chrome.extension.getBackgroundPage();
const bgApp = (bgWindow as Window).app;

const Popup: React.FunctionComponent = () => {
    const [status, setStatus] = useState<'support' | 'not support' | 'not correct page'>('not support');
    const [info, setInfo] = useState<Novel>({});
    const [loading, setLoading] = useState(false);

    // 获取小说数据
    const getInfo = (url?: string) => {
        if (!url) return;
        setLoading(true);
        Downloader.getPageInfo(url).then((novel) => {
            setInfo(novel);
            setLoading(false);
        });
    };

    // 获取当前页面的状态
    const getPageStatus = (url: string) => {
        const hostname = getHostName(url);
        const rule = rules[hostname];
        if (rule) {
            if (rule.regExp.test(url)) {
                return 'support';
            } 
                return 'not correct page';
            
        }
        return 'not support';
    };

    useEffect(() => {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
            if (tabs && tabs.length > 0) {
                const tab = tabs[0];
                const pageStatus = getPageStatus(tab.url || '');
                setStatus(pageStatus);
                if (pageStatus === 'support') {
                    getInfo(tab.url);
                }
            }
        });
    }, []);

    return (
      <div>
        {
              status === 'not support' && (
              <Result
                status='error'
                title='当前网站不支持下载'
                extra={
                  <WebList />
                }
                  />
              )
          }
        {
              status === 'not correct page' && (
              <Result
                status='warning'
                title='不在小说主页'
                subTitle='当前网站小说支持下载，请进入小说主页'
                />
              )
        }
        {
            status === 'support' && (
            <Spin spinning={loading}>
              <div className='info'>
                <div className='info-wrap'>
                  <div className='cover-img'>
                    <img src={info.coverImgUrl || '/noCover.jpeg'} alt='cover'/>
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
                  <span>{info.chapters?.length} 章</span>
                  <a>下载</a>
                </div>
              </div>
            </Spin>
            )
        }
      </div>
    );
};

export default Popup;
