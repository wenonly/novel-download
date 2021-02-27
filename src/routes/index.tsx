import React from 'react';
import { RouteConfig } from 'react-router-config';
import MainLayout from '@/layouts/MainLayout';
import { Redirect } from 'react-router-dom';
import adminRoutes from './adminRoutes';

const routes: RouteConfig[] = [
  {
    path: '/',
    exact: true,
    // eslint-disable-next-line react/display-name
    render: () => <Redirect to='/admin/page/1' />
  },
  {
    path: '/admin',
    component: MainLayout,
    routes: adminRoutes
  }
];

export default routes;
