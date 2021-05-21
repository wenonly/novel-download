/* eslint-disable lines-between-class-members */
// eslint-disable-next-line max-classes-per-file
import { getHostName, sleep } from '@/utils';
import request from '../request';
import rules, { Chapter, Novel, Rule } from '../rules';

export enum DownloadStatus {
  notStart = 'not start',
  downloading = 'downloading',
  generating = 'generating',
  success = 'success',
  error = 'error'
}

export type HanlerCallback = (novel: Novel, status: DownloadStatus, chapterLen: number) => void;

export class Downloader {
  status: DownloadStatus = DownloadStatus.notStart;
  mainUrl = '';
  curRule?: Rule;
  thread = 10; // 线程数
  usingThread = 0;

  novel: Novel = {
    chapters: []
  };
  chapterLen = 0; // 已下载的章节数量
  errorTag = false

  // 下面两个都是change时回调
  callback?: HanlerCallback; // 创建时设置回调
  changeCallback?: HanlerCallback; // 通过api设置回调

  constructor(url: string, callback?: HanlerCallback) {
    this.mainUrl = url;
    const hostname = getHostName(this.mainUrl);
    const curRule = rules[hostname];
    this.curRule = curRule;
    if (!this.curRule) return;
    this.callback = callback;
    this.start();
  }

  start() {
    this.setChapterLen(0);
    this.errorTag = false;
    this.usingThread = 0;
    this.setStatus(DownloadStatus.downloading);
    Downloader.getPageInfo(this.mainUrl).then(novel => {
      this.novel = novel;
      this.getChapters();
    });
  }


  stop() {
    this.errorTag = true;
  }

  chapterTime: any = null;
  setChapterLen(num: number) {
    // 这里进行报错，长时间进度没变化则说明下载失败
    this.chapterLen = num;
    clearTimeout(this.chapterTime);
    if (this.chapterLen !== this.novel.chapters.length) {
        this.chapterTime = setTimeout(() => {
            this.setStatus(DownloadStatus.error);
            this.stop();
        }, 15000);
    }
  }

  private setStatus(val: DownloadStatus) {
    this.status = val;
    this.update();
  }

  private update() {
    this.callback && this.callback(this.novel, this.status, this.chapterLen);
    this.changeCallback && this.changeCallback(this.novel, this.status, this.chapterLen);
  }

  onChange(callback: HanlerCallback) {
    this.changeCallback = callback;
  }

  // 获取小说信息
  static getPageInfo(url: string) {
    const hostname = getHostName(url);
    const curRule = rules[hostname];
    if (curRule) {
      return request.get(url).then((res: { data: string; }) => {
        const html: string = res.data;
        return {
          title: curRule.title(html),
          coverImgUrl: curRule.coverImgUrl(html),
          author: curRule.author(html),
          category: curRule.category(html),
          updateTime: curRule.updateTime(html),
          description: curRule.description(html),
          chapters: curRule.chapterList(html, url)
        };
      });
    }
    return Promise.reject(new Error('没有当前链接的规则'));
  }

  // 下载章节
  private async getChapters() {
    const list = [];
    for (const item of this.novel.chapters || []) {
      list.push(this.getChapter(item));
    }
    Promise.all(list)
      .then(() => {
        this.genEpub();
      })
      .catch(() => {
        this.setStatus(DownloadStatus.error);
      });
  }

  private async getChapter(chapter: Chapter) {
    if (!chapter.url) return;
    if (this.errorTag) {
        throw new Error('下载已停止');
    }
    if (this.usingThread >= this.thread) {
      // 等待500毫秒
      await sleep(500);
      await this.getChapter(chapter);
      return;
    }
    this.usingThread += 1;
    // console.log(`正在下载章节 ${chapter.title}: ${chapter.url}`);
    try {
      const res = await request.get(chapter.url as string);
      const html = res.data;
      Object.assign(chapter, this.curRule?.chapter(html) || {});
      this.setChapterLen(this.chapterLen + 1);
      this.usingThread -= 1;
      this.update();
    } catch {
      this.usingThread -= 1;
      await sleep(500);
      await this.getChapter(chapter);
    }
  }

  async genEpub() {
    this.setStatus(DownloadStatus.generating);
    const JEpub = jEpub;
    const jepub = new JEpub();
    jepub.init({
      title: this.novel.title,
      author: this.novel.author,
      publisher: '小说下载器',
      description: this.novel.description // optional
    });
    jepub.uuid(this.mainUrl);
    const cover = await request.getImage(this.novel.coverImgUrl || '/noCover.jpeg');
    jepub.cover(cover);
    for (const item of this.novel.chapters || []) {
      jepub.add(item.title, item.content);
    }
    const blob = await jepub.generate();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${this.novel.title}.epub`;

    link.click();
    this.setStatus(DownloadStatus.success);
  }
}

export class DownloaderStack {
  stack: { [url: string]: Downloader } = {};
  callback?: HanlerCallback;

  push(url: string) {
    this.stack[url] = new Downloader(url, (novel: Novel, status: DownloadStatus, chapterLen: number) => {
      if (status === DownloadStatus.success) {
        delete this.stack[url];
      }
      this.callback && this.callback(novel, status, chapterLen);
    });
    return this.stack[url];
  }

  get(url: string) {
    return this.stack[url];
  }

  getAll() {
    return this.stack;
  }

  onChange(callback: (val: { [url: string]: Downloader }) => void) {
    this.callback = () => callback(this.stack);
  }
}
