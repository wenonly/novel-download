import React from 'react';
import { HashRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import routes from '@/routes';
import 'antd/dist/antd.css';
import './app.scss';

const App: React.FunctionComponent = () => <HashRouter>{renderRoutes(routes)}</HashRouter>;

export default App;
