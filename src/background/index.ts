import axios from 'axios';
import url from 'url';
import { clearStorage, formatCookie, getStorage, setStorage } from './utils';

isDev && require('crx-hotreload'); // 如果是开发环境则自动重加载

window.app = {};

// 获取京东的cookie
function getCookieFromJd() {
  return new Promise<chrome.cookies.Cookie[]>(resolve => {
    chrome.cookies.getAll(
      {
        url: 'https://global.jd.com/'
      },
      (cookies: chrome.cookies.Cookie[]) => {
        resolve(cookies);
      }
    );
  });
}

// 获取京东的cookie并存入storage
async function saveCookies() {
  // 获取jdcookie并存入storage
  await getCookieFromJd().then(async (cookies: chrome.cookies.Cookie[]) => {
    const { cookieStr, cookieObj } = formatCookie(cookies as chrome.cookies.Cookie[]);
    document.cookie = cookieStr;
    await clearStorage();
    await setStorage({
      jdCookieStr: cookieStr,
      jdCookies: cookies,
      jdCookieObj: cookieObj
    });
    return cookies;
  });
}

// 判断是否登录
async function getLoginInfo() {
  const jdCookieObj: any = await getStorage('jdCookieObj');
  if (!jdCookieObj.thor) return null;
  return {
    username: decodeURI(jdCookieObj.unick)
  };
}

// 自运行代码
(async () => {
  // 定时任务
  setInterval(async () => {
    await saveCookies();
  }, 1000);

  // 向window上面绑定函数
  window.app.getLoginInfo = getLoginInfo;
})();
