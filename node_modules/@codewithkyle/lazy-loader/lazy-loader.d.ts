export type Loading = "eager" | "lazy";

export type LazyLoaderSettings = {
    cssDir?: string;
    jsDir?: string;
};

declare const configure: (settings?:Partial<LazyLoaderSettings>) => void;
declare const update: () => void;
declare const mount: (tagName:string, constructor?: CustomElementConstructor) => Promise<void>;
declare const css: (files:string|string[]) => Promise<void>;