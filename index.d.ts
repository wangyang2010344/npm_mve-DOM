import { EOChildren } from "@wangyang2010344/mve/childrenBuilder";
import { mve } from "@wangyang2010344/mve/util";
import { VirtualChildParam } from "@wangyang2010344/mve/virtualTreeChildren";
export declare class DOMVirtualParam implements VirtualChildParam<Node> {
    private pel;
    constructor(pel: Node);
    append(el: any, isMove: any): void;
    remove(el: any): void;
    insertBefore(el: any, oldEl: any, isMove: any): void;
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
    [key: string]: mve.MTValue<string>;
} & {
    opacity?: mve.MTValue<number | string>;
};
export declare type ActionHandler = (e: any) => void;
/**动作树 */
export declare type ActionItem = ActionHandler | {
    capture?: boolean;
    handler: ActionHandler;
} | ActionItem[];
export declare type ActionMap = {
    [key: string]: ActionItem;
};
export declare function reWriteAction(n: ActionMap, act: string, fun: (vs: ActionItem[]) => ActionItem[]): void;
declare type InitFun = (v: any, me: mve.LifeModel) => void;
export declare function reWriteInit(v: DOMNode, fun: (vs: InitFun[]) => InitFun[]): void;
declare type DestoryFun = (v: any) => void;
export declare function reWriteDestroy(v: DOMNode, fun: (vs: DestoryFun[]) => DestoryFun[]): void;
export interface DOMNode {
    type: string;
    init?: InitFun | InitFun[];
    destroy?: DestoryFun | DestoryFun[];
    id?: (o: any) => void;
    cls?: StringValue;
    attr?: AttrMap;
    style?: StyleMap;
    prop?: PropMap;
    action?: ActionMap;
    value?: ItemValue;
    children?: EOChildren<Node>;
    text?: ItemValue;
}
export declare type DOMNodeAll = DOMNode | string;
export declare const dom: import("@wangyang2010344/mve/index").ElementResult<DOMNodeAll, Node>;
export declare const svg: import("@wangyang2010344/mve/index").ElementResult<DOMNode, Node>;
export {};
