import { EOChildren } from "mve-core/childrenBuilder";
import { mve } from "mve-core/util";
import { VirtualChildParam } from "mve-core/virtualTreeChildren";
/**
 * 在DOM里，移动其实是少用的
 * 比如窗口，使用z-index的方式，不使用移动
 * 别的表格拖拽，似乎更是根据模型在相应区域重新生成视图
 */
export declare class DOMVirtualParam implements VirtualChildParam<Node> {
    private pel;
    constructor(pel: Node);
    append(el: Node, isMove: boolean): void;
    remove(el: Node): void;
    insertBefore(el: Node, oldEl: Node, isMove: boolean): void;
}
export declare class DOMVirtualParamReverse implements VirtualChildParam<Node> {
    private pel;
    constructor(pel: Node);
    remove(e: Node): void;
    append(e: Node, isMove?: boolean): void;
    insertBefore(e: Node, old: Node, isMove?: boolean): void;
}
export declare type StringValue = mve.MTValue<string>;
export declare type ItemValue = mve.MTValue<string | number | boolean>;
export declare type AttrMap = {
    [key: string]: ItemValue;
};
export declare type PropMap = {
    [key: string]: mve.MTValue<string | number | boolean>;
};
export declare type StyleMap = {
    [key: string]: mve.MTValue<string | number>;
};
export declare type EventHandler = (e: any) => void;
/**动作树 */
export declare type EventItem = EventHandler | {
    capture?: boolean;
    handler: EventHandler;
} | EventItem[];
export declare type EventMap = {
    [key: string]: EventItem;
};
export declare function reWriteEvent(n: EventMap, eventName: string, fun: (vs: EventItem[]) => EventItem[]): void;
declare type InitFun = (v: any, me: mve.LifeModel) => void;
export declare function reWriteInit(v: DOMNode, fun: (vs: InitFun[]) => InitFun[]): void;
declare type DestoryFun = (v: any) => void;
export declare function reWriteDestroy(v: DOMNode, fun: (vs: DestoryFun[]) => DestoryFun[]): void;
export interface DOMNode {
    type: string;
    init?: InitFun | InitFun[];
    destroy?: DestoryFun | DestoryFun[];
    id?: StringValue;
    cls?: StringValue;
    attr?: AttrMap;
    style?: StyleMap;
    prop?: PropMap;
    event?: EventMap;
    value?: ItemValue;
    children?: EOChildren<Node>;
    text?: ItemValue;
    childrenReverse?: boolean;
}
export declare type DOMNodeAll = DOMNode | string;
export declare const dom: import("mve-core/index").ElementResult<DOMNodeAll, Node>;
export declare const svg: import("mve-core/index").ElementResult<DOMNode, Node>;
/**生成唯一ID*/
export declare function idOf(name: string): string;
/**生成唯一class */
export declare function clsOf(name: string): string;
export {};
