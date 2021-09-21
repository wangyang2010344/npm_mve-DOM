"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
exports.clsOf = exports.idOf = exports.svg = exports.dom = exports.reWriteDestroy = exports.reWriteInit = exports.reWriteEvent = exports.DOMVirtualParamReverse = exports.DOMVirtualParam = void 0;
var childrenBuilder_1 = require("mve-core/childrenBuilder");
var index_1 = require("mve-core/index");
var util_1 = require("mve-core/util");
var DOM = __importStar(require("./DOM"));
/**
 * 在DOM里，移动其实是少用的
 * 比如窗口，使用z-index的方式，不使用移动
 * 别的表格拖拽，似乎更是根据模型在相应区域重新生成视图
 */
var DOMVirtualParam = /** @class */ (function () {
    function DOMVirtualParam(pel) {
        this.pel = pel;
    }
    DOMVirtualParam.prototype.append = function (el, isMove) {
        DOM.appendChild(this.pel, el, isMove);
    };
    DOMVirtualParam.prototype.remove = function (el) {
        DOM.removeChild(this.pel, el);
    };
    DOMVirtualParam.prototype.insertBefore = function (el, oldEl, isMove) {
        DOM.insertChildBefore(this.pel, el, oldEl, isMove);
    };
    return DOMVirtualParam;
}());
exports.DOMVirtualParam = DOMVirtualParam;
var DOMVirtualParamReverse = /** @class */ (function () {
    function DOMVirtualParamReverse(pel) {
        this.pel = pel;
    }
    DOMVirtualParamReverse.prototype.remove = function (e) {
        DOM.removeChild(this.pel, e);
    };
    DOMVirtualParamReverse.prototype.append = function (e, isMove) {
        DOM.prefixChild(this.pel, e, isMove);
    };
    DOMVirtualParamReverse.prototype.insertBefore = function (e, old, isMove) {
        DOM.insertChildAfter(this.pel, e, old, isMove);
    };
    return DOMVirtualParamReverse;
}());
exports.DOMVirtualParamReverse = DOMVirtualParamReverse;
function reWriteEvent(n, eventName, fun) {
    var v = n[eventName];
    if (util_1.isArray(v)) {
        n[eventName] = fun(v);
    }
    else if (v) {
        n[eventName] = fun([v]);
    }
    else {
        n[eventName] = fun([]);
    }
}
exports.reWriteEvent = reWriteEvent;
function reWriteInit(v, fun) {
    if (util_1.isArray(v.init)) {
        v.init = fun(v.init);
    }
    else if (v.init) {
        v.init = fun([v.init]);
    }
    else {
        v.init = fun([]);
    }
}
exports.reWriteInit = reWriteInit;
function reWriteDestroy(v, fun) {
    if (util_1.isArray(v.destroy)) {
        v.destroy = fun(v.destroy);
    }
    else if (v.destroy) {
        v.destroy = fun([v.destroy]);
    }
    else {
        v.destroy = fun([]);
    }
}
exports.reWriteDestroy = reWriteDestroy;
function buildParam(me, el, child) {
    if (child.event) {
        for (var k in child.event) {
            var v = child.event[k];
            if (util_1.isArray(v)) {
                for (var _i = 0, v_1 = v; _i < v_1.length; _i++) {
                    var vv = v_1[_i];
                    DOM.event(el, k, vv);
                }
            }
            else {
                DOM.event(el, k, v);
            }
        }
    }
    if (child.style) {
        index_1.parseUtil.bindKV(me, child.style, function (k, v) {
            DOM.style(el, k, v);
        });
    }
    if (child.attr) {
        index_1.parseUtil.bindKV(me, child.attr, function (k, v) {
            DOM.attr(el, k, v);
        });
    }
    if (child.prop) {
        index_1.parseUtil.bindKV(me, child.prop, function (k, v) {
            DOM.prop(el, k, v);
        });
    }
    if (child.cls) {
        index_1.parseUtil.bind(me, child.cls, function (v) {
            DOM.attr(el, "class", v);
        });
    }
    if (child.id) {
        index_1.parseUtil.bind(me, child.id, function (v) {
            DOM.attr(el, "id", v);
        });
    }
    if (child.text) {
        index_1.parseUtil.bind(me, child.text, function (v) {
            DOM.content(el, v);
        });
    }
    var ci = {};
    if (child.init) {
        if (util_1.isArray(child.init)) {
            var inits = child.init;
            for (var _a = 0, inits_1 = inits; _a < inits_1.length; _a++) {
                var init = inits_1[_a];
                init(el, me);
            }
        }
        else {
            var init_1 = child.init;
            ci.init = function () {
                init_1(el, me);
            };
        }
    }
    if (child.destroy) {
        if (util_1.isArray(child.destroy)) {
            var destroys_1 = child.destroy;
            ci.destroy = function () {
                for (var _i = 0, destroys_2 = destroys_1; _i < destroys_2.length; _i++) {
                    var destroy = destroys_2[_i];
                    destroy(el);
                }
            };
        }
        else {
            var destroy_1 = child.destroy;
            ci.destroy = function () {
                destroy_1(el);
            };
        }
    }
    return ci;
}
function buildParamAfter(me, el, child) {
    /**
     * value必须在Attr后面才行，不然type=range等会无效
     * select的value必须放在children后，不然会无效
     */
    if (child.value) {
        index_1.parseUtil.bind(me, child.value, function (v) {
            DOM.value(el, v);
        });
    }
}
exports.dom = index_1.buildElementOrginal(function (me, n, life) {
    n = n || "";
    if (typeof (n) == 'string') {
        var txt = DOM.createTextNode(n);
        if (life) {
            return { element: txt, init: life.init, destroy: life.destroy };
        }
        else {
            return { element: txt, init: null, destroy: null };
        }
    }
    else {
        var element = DOM.createElement(n.type);
        var out = util_1.BuildResultList.init();
        var ci = buildParam(me, element, n);
        if ('children' in n) {
            var children = n.children;
            if (children) {
                var virtualParam = n.childrenReverse ? new DOMVirtualParamReverse(element) : new DOMVirtualParam(element);
                out.push(childrenBuilder_1.childrenBuilder(me, virtualParam, children));
            }
        }
        buildParamAfter(me, element, n);
        out.push(ci);
        if (life) {
            out.push(life);
        }
        return util_1.onceLife(out.getAsOne(element)).out;
    }
});
exports.svg = index_1.buildElement(function (me, n, out) {
    var element = DOM.createElementNS(n.type, "http://www.w3.org/2000/svg");
    var ci = buildParam(me, element, n);
    if ('children' in n) {
        var children = n.children;
        if (children) {
            var virtualParam = n.childrenReverse ? new DOMVirtualParamReverse(element) : new DOMVirtualParam(element);
            out.push(childrenBuilder_1.childrenBuilder(me, virtualParam, children));
        }
    }
    buildParamAfter(me, element, n);
    out.push(ci);
    return element;
});
var idCount = 0;
/**生成唯一ID*/
function idOf(name) {
    return name + (idCount++);
}
exports.idOf = idOf;
var clsCount = 0;
/**生成唯一class */
function clsOf(name) {
    return name + (clsCount++);
}
exports.clsOf = clsOf;
