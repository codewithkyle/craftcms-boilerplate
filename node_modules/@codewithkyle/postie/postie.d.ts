export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type AcceptHeader = "application/json" | "text/html";

export type Prompt = "confirm" | "input" | null;

export type Swap = "inner" | "outer" | "innerHTML" | "outerHTML";

export type PostieSettings = {
    method: RequestMethod;
    accept: AcceptHeader;
    data: DOMStringMap;
    endpoint: string;
    prompt: Prompt;
    promptLabel: string | null;
    promptValue: string;
    promptName: string;
    success: string | null;
    error: string | null;
    preventDisable: boolean;
    once: boolean;
    target: string;
    swap: Swap;
    el: HTMLElement;
    reset: number;
};
