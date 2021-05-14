import React from 'react';
import { List, Typography } from 'antd';
import rules from '../../rules';

const list = Object.keys(rules).map(key => ({
  ...rules[key]
}));

const WebList: React.FunctionComponent = () => {
  const openPage = (url: string) => {
    chrome.tabs.create({ url });
  };
  return (
    <List
      bordered
      dataSource={list}
      header={<div>支持网站列表</div>}
      renderItem={item => (
        <List.Item>
          <span>{item.ruleTitle}</span>
          <a onClick={() => openPage(item.ruleUrl)}>{item.ruleUrl}</a>
        </List.Item>
      )}
    />
  );
};

export default WebList;
