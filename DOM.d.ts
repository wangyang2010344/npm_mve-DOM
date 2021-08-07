interface ScrollKeep {
    top: number;
    left: number;
    el: Element;
}
declare function keepScroll(el: Element): ScrollKeep[];
declare function reverScroll(store: ScrollKeep[]): void;
/**保存如滚动之类，在从DOM上剪切移动之前 */
export declare const saveBeforeMove: typeof keepScroll;
/**恢复如滚动之类，在从DOM上剪切移动之后 */
export declare const revertAfterMove: typeof reverScroll;
export declare const keyCode: {
    BACKSPACE: (e: KeyboardEvent) => boolean;
    ENTER: (e: KeyboardEvent) => boolean;
    TAB: (e: KeyboardEvent) => boolean;
    ARROWLEFT: (e: KeyboardEvent) => boolean;
    ARROWUP: (e: KeyboardEvent) => boolean;
    ARROWRIGHT: (e: KeyboardEvent) => boolean;
    ARROWDOWN: (e: KeyboardEvent) => boolean;
    CONTROL: (e: KeyboardEvent) => boolean;
    /**windows键 */
    META: (e: KeyboardEvent) => boolean;
    ALT: (e: KeyboardEvent) => boolean;
    A: (e: KeyboardEvent) => boolean;
    Z: (e: KeyboardEvent) => boolean;
    V: (e: KeyboardEvent) => boolean;
    C: (e: KeyboardEvent) => boolean;
    X: (e: KeyboardEvent) => boolean;
};
export declare function createElement(type: string): HTMLElement;
export declare function createElementNS(type: any, NS: any): HTMLElement;
export declare function createTextNode(json: any): Text;
export declare function appendChild(el: any, child: any, isMove?: boolean): void;
export declare function replaceWith(el: any, newEL: any): void;
export declare function insertChildBefore(pel: any, new_el: any, old_el: any, isMove?: boolean): void;
export declare function removeChild(el: any, child: any): void;
export declare function empty(el: any): void;
export declare function attr(el: any, key: any, value: any): void;
export declare function style(el: any, key: any, value: any): void;
export declare function prop(el: any, key: any, value: any): void;
export declare function event(el: any, key: any, value: any): void;
export declare function text(el: any, value: any): void;
export declare function content(el: any, value: any): void;
export declare function value(el: any, value: any): void;
export declare function html(el: any, value: any): void;
export {};
