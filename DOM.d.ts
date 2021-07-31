interface ScrollKeep {
    top: number;
    left: number;
    el: Element;
}
declare function keepScroll(el: Element): ScrollKeep[];
declare function reverScroll(store: ScrollKeep[]): void;
declare const _default: {
    /**保存如滚动之类，在从DOM上剪切移动之前 */
    saveBeforeMove: typeof keepScroll;
    /**恢复如滚动之类，在从DOM上剪切移动之后 */
    revertAfterMove: typeof reverScroll;
    keyCode: {
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
    createElement(type: string): HTMLElement;
    createElementNS(type: any, NS: any): HTMLElement;
    createTextNode(json: any): Text;
    appendChild(el: any, child: any, isMove?: boolean): void;
    replaceWith(el: any, newEL: any): void;
    insertChildBefore(pel: any, new_el: any, old_el: any, isMove?: boolean): void;
    removeChild(el: any, child: any): void;
    empty(el: any): void;
    attr(el: any, key: any, value: any): void;
    style(el: any, key: any, value: any): void;
    prop(el: any, key: any, value: any): void;
    action(el: any, key: any, value: any): void;
    text(el: any, value: any): void;
    content(el: any, value: any): void;
    value(el: any, value: any): void;
    html(el: any, value: any): void;
};
export = _default;
