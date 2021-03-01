// 将cookies转为字符串
export function formatCookie(cookies: chrome.cookies.Cookie[]) {
  let cookieStr = '';
  const cookieObj: any = {};
  for (const c of cookies) {
    cookieStr += `${c.name}=${c.value}; `;
    cookieObj[c.name] = c.value;
  }
  return {
    cookieStr,
    cookieObj
  };
}

// 获取storage数据
export function getStorage(key: string) {
  return new Promise<string>((resolve, reject) => {
    chrome.storage.sync.get(key, obj => {
      obj[key] ? resolve(obj[key]) : reject();
    });
  });
}

// 设置storage数据
export function setStorage(obj: any) {
  return new Promise(resolve => {
    chrome.storage.sync.set(obj, () => {
      resolve(obj);
    });
  });
}

// 设置storage数据
export function clearStorage() {
  return new Promise(resolve => {
    chrome.storage.sync.clear(() => {
      resolve(null);
    });
  });
}
