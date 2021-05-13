import { getDomFromHtml } from './utils';

export interface Novel {
    title?: string
    coverImgUrl?: string
    coverImg?: File
    author?: string
    category?: string
    updateTime?: string
    description?: string
    chapters: Chapter[]
}

export interface Chapter {
    url?: string
    title?: string
    content?: string
}

export interface Rule {
    regExp: RegExp // 用于匹配可以爬取的页面url
    ruleTitle: string // 比如笔趣阁
    ruleUrl: string
    title: (html: string) => string
    author: (html: string) => string
    coverImgUrl: (html: string) => string
    category: (html: string) => string
    updateTime: (html: string) => string
    description: (html: string) => string
    chapterList: (html: string, url: string) => Chapter[]
    chapter: (html: string) => Chapter // 给章节页面html，解析为章节
}

const rules: {[url: string]: Rule} = {
    'www.biquwx.la': {
        regExp: /.*www\.biquwx\.la\/\d+_\d+/,
        ruleUrl: 'https://www.biquwx.la',
        ruleTitle: '笔趣阁',
        title: (html) => getDomFromHtml(html).querySelector('#info h1')?.textContent || '',
        author: (html) => getDomFromHtml(html).querySelector('#maininfo #info p')?.textContent || '',
        coverImgUrl: (html) => getDomFromHtml(html).querySelector('#fmimg img')?.getAttribute('src') || '',
        category: (html) => getDomFromHtml(html).querySelector('#maininfo #info p:nth-of-type(2)')?.textContent || '',
        updateTime: (html) => getDomFromHtml(html).querySelector('#maininfo #info p:nth-of-type(3)')?.textContent || '',
        description: (html) => getDomFromHtml(html).querySelector('#intro p')?.textContent || '',
        chapterList: (html: string, mainUrl: string) => {
            const list = getDomFromHtml(html).querySelectorAll('#list dl dd a');
            const chapterList: Chapter[] = [];
            for (const item of list) {
                const url = `${mainUrl}${ item.getAttribute('href')}` || '';
                const title = item.textContent || '';
                chapterList.push({
                    url,
                    title
                });
            }
            return chapterList;
        },
        chapter: (html) => {
            const title = getDomFromHtml(html).querySelector('.bookname h1')?.textContent || '';
            const content = getDomFromHtml(html).querySelector('#content')?.innerHTML;
            const chapter: Chapter = {
                title,
                content
            };
            return chapter;
        }
    }
};

export default rules;