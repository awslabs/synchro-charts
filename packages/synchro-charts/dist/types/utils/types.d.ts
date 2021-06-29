export declare type CustomHTMLElement<T> = T & HTMLElement;
export interface Size {
    width: number;
    height: number;
}
export interface StencilCSSProperty {
    [key: string]: string | undefined;
}
export declare type RectScrollFixed = Omit<DOMRect, 'toJSON'> & {
    density: number;
};
export declare type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends object ? RecursivePartial<T[P]> : T[P];
};
