import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const request = axios.create();

const getImage = (url: string) => request({
    url,
    method: 'get',
    responseType: 'blob'
}).then(response => {
    if (response.status === 200) return response.data;
    throw new Error('失败');
});

class Cache {
    data: {
        [key: string] : {
            expireDate: number,
            response: AxiosResponse<any>
        }
    } = {}

    constructor() {
        // 每分钟清理一下过期缓存
        setInterval(() => {
            for (const key of Object.keys(this.data)) {
                const data = this.data[key];
                if (data && data.expireDate <= Date.now()) { delete this.data[key]; }
            };
        }, 1000 * 60);
    }

    // 设置缓存，默认过期时间为1个小时
    setCathe(key: string, val: AxiosResponse<any>, expireTime: number = 1000 * 60 * 60) {
        this.data[key] = {
            expireDate: Date.now() + expireTime,
            response: val
        };
    }

    getCache(key: string) {
        const data = this.data[key];
        if (data && data.expireDate > Date.now()) {
            return data.response;
        }
        return false;
    }
}

const cache = new Cache();

const get = (url: string, config?: AxiosRequestConfig, expireTime?: number) => new Promise<AxiosResponse<any>>((resolve, reject) => {
        const cacheRes = cache.getCache(url);
        if (cacheRes) resolve(cacheRes); 
        else {
            request.get(url, config).then(res => {
                cache.setCathe(url, res, expireTime);
                resolve(res);
            }).catch(error => reject(error));
        }
    });

export default {
    ...request,
    getImage,
    get
};