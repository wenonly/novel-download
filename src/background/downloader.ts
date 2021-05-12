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
    error = 'error',
}

type HanlerCallback = (novel: Novel, status: DownloadStatus, chapterLen: number) => void

export class Downloader {
    status: DownloadStatus = DownloadStatus.notStart
    mainUrl = ''
    curRule?: Rule
    thread = 10 // 线程数
    usingThread = 0

    novel: Novel = {}
    chapterLen = 0 // 已下载的章节数量

    callback?: HanlerCallback

    constructor(url: string, callback?: HanlerCallback) {
        this.mainUrl = url;
        const hostname = getHostName(this.mainUrl);
        const curRule = rules[hostname];
        this.curRule = curRule;
        if (!this.curRule) return;
        this.callback = callback;
        this.setStatus(DownloadStatus.downloading);
        Downloader.getPageInfo(this.mainUrl).then((novel) => {
            this.novel = novel;
            this.getChapters();
        });
    }

    getStatus() {
        return this.status;
    }

    private setStatus(val: DownloadStatus) {
        this.status = val;
        console.log('status:', val);
        this.callback && this.callback(this.novel, val, this.chapterLen);
    }

    // 获取小说信息
    static getPageInfo(url: string) {
        const hostname = getHostName(url);
        const curRule = rules[hostname];
        if (curRule) {
            return request.get(url).then<Novel>((res) => {
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
        Promise.all(list).then(() => {
            this.genEpub();
        }).catch(() => {
            this.setStatus(DownloadStatus.error);
        });
    }

    private async getChapter(chapter: Chapter) {
        if (!chapter.url) return;
        if (this.usingThread >= this.thread) {
            // 等待500毫秒
            await sleep(500);
            await this.getChapter(chapter);
            return;
        }
        this.usingThread += 1;
        console.log(`正在下载章节 ${chapter.title}: ${chapter.url}`);
        try {
            const res = await request.get(chapter.url as string);
            const html = res.data;
            Object.assign(chapter, this.curRule?.chapter(html) || {});
            this.chapterLen += 1;
            this.usingThread -= 1;
            this.setStatus(DownloadStatus.downloading);
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
        link.download = `${this.novel.title  }.epub`;

        link.click();
        this.setStatus(DownloadStatus.success);
    }
}



export class DownloaderStack {
    stack: {[url: string] : Downloader} = {}
    callback?: HanlerCallback

    push(url: string) {
        if (!this.stack[url]) {
            this.stack[url] = new Downloader(url, (novel: Novel, status: DownloadStatus, chapterLen: number) => {
                this.callback && this.callback(novel, status, chapterLen);
                if (status === DownloadStatus.success) {
                    delete this.stack[url];
                }
            });
        }
    }

    get(url: string) {
        return this.stack[url];
    }

    on(callback: (val: {[url: string] : Downloader} | Downloader) => void, url?: string) {
        this.callback = () => {
            callback(url ? this.stack[url]: this.stack);
        };
    }
}