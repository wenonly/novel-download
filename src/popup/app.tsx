import React from 'react';

const bgWindow = chrome.extension.getBackgroundPage();

const Popup: React.FunctionComponent = () => {
  // 跳转到京东登陆页面
  const toJdLogin = () => {
    window.open('https://passport.jd.com/new/login.aspx?ReturnUrl=https%3A%2F%2Fwww.jd.com%2F2017');
  };

  return (
    <div className='popupWrap'>
      <img src='/icon.png' alt='icon' />
      <a className='no-login' onClick={toJdLogin}>
        未登陆
      </a>
    </div>
  );
};

export default Popup;
