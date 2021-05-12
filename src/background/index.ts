import {DownloaderStack} from './downloader';

isDev && require('crx-hotreload'); // 如果是开发环境则自动重加载

window.app = {
    stack: new DownloaderStack()
};