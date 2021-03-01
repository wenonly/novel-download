import React, { useEffect, useState } from 'react';

const bgWindow = chrome.extension.getBackgroundPage();
const bgApp = (bgWindow as Window).app;

const Popup: React.FunctionComponent = () => {
  const [userInfo, setUserInfo] = useState<any>({});

  // 跳转到京东登陆页面
  const toJdLogin = () => {
    window.open('https://passport.jd.com/new/login.aspx?ReturnUrl=https%3A%2F%2Fwww.jd.com%2F2017');
  };

  useEffect(() => {
    bgApp.getLoginInfo().then((info: any) => {
      setUserInfo(info);
    });
  }, []);

  return (
    <div className='popupWrap'>
      <img src='/icon.png' alt='icon' />
      {userInfo ? (
        <div>
          <span className='title'>{userInfo.username}</span>
          <span>已登录</span>
        </div>
      ) : (
        <a className='title' onClick={toJdLogin}>
          未登陆
        </a>
      )}
    </div>
  );
};

export default Popup;
