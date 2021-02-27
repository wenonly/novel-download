import React from 'react';
import { Layout } from 'antd';
import LeftSideBar from '@/layouts/LeftSideBar';
import Logo from '@/components/Logo';
import { RouteConfigComponentProps, renderRoutes } from 'react-router-config';
import styles from './index.module.scss';

const { Sider, Content } = Layout;

const MainLayout: React.FunctionComponent<RouteConfigComponentProps> = (props: RouteConfigComponentProps) => {
  const { route } = props;
  console.log(route);
  return (
    <Layout className={styles.layoutWrap}>
      <Sider width={256}>
        <Logo />
        <LeftSideBar />
      </Sider>
      <Layout>
        <Content>{renderRoutes(route?.routes)}</Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
