import { DownloaderStack } from '@/background/downloader';

declare global {
    interface Window {
        app: {
            stack: DownloaderStack
        }
    }
    interface Document {
        adoptedStyleSheets: any
    }
}