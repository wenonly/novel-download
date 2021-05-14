import React from 'react';
import { Tabs } from 'antd';
import { HomeOutlined, DownloadOutlined } from '@ant-design/icons';
import NovelInfo from './components/NovelInfo';
import DownloadList from './components/DownloadList';

const { TabPane } = Tabs;

const Popup: React.FunctionComponent = () => (
  <div className='popup-wrap'>
    <Tabs defaultActiveKey='1' tabPosition='left'>
      <TabPane
        tab={ <HomeOutlined /> }
        key='1'
        >
        <NovelInfo />
      </TabPane>
      <TabPane
        tab={ <DownloadOutlined /> }
        key='2'
        >
        <DownloadList />
      </TabPane>
    </Tabs>
  </div>
  );

export default Popup;
