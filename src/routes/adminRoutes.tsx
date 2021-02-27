import React, { lazy } from 'react';
import { RouteConfig } from 'react-router-config';
import { Redirect } from 'react-router-dom';
import SuspenseComponent from '@/layouts/SuspenseComponent';
import ViewLayout from '@/layouts/ViewLayout';

const Page1 = lazy(() => import('@/pages/page1'));
const Page2 = lazy(() => import('@/pages/page2'));

const routes: RouteConfig[] = [
  {
    path: '/admin',
    exact: true,
    // eslint-disable-next-line react/display-name
    render: () => <Redirect to='/admin/page/1' />
  },
  {
    path: '/admin/page',
    title: '页面',
    component: ViewLayout,
    routes: [
      {
        path: '/admin/page/1',
        title: '页面1',
        component: SuspenseComponent(Page1)
      },
      {
        path: '/admin/page/2',
        title: '页面2',
        component: SuspenseComponent(Page2)
      }
    ]
  },
  {
    path: '/admin/page2',
    title: '页面22',
    component: ViewLayout,
    routes: [
      {
        path: '/admin/page2/1',
        title: '页面1',
        component: SuspenseComponent(Page1)
      },
      {
        path: '/admin/page2/2',
        title: '页面2',
        component: SuspenseComponent(Page2)
      }
    ]
  }
];

export default routes;
