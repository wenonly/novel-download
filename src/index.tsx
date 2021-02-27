import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

// 热更新
if (module && module.hot) {
  module.hot.accept();
}

ReactDOM.render(<App />, document.querySelector('#app'));
