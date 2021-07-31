"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.svg = exports.dom = exports.reWriteDestroy = exports.reWriteInit = exports.reWriteAction = exports.DOMVirtualParam = void 0;
var childrenBuilder_1 = require("@wangyang2010344/mve/childrenBuilder");
var index_1 = require("@wangyang2010344/mve/index");
var util_1 = require("@wangyang2010344/mve/util");
var DOM_1 = __importDefault(require("./DOM"));
var DOMVirtualParam = /** @class */ (function () {
    function DOMVirtualParam(pel) {
        this.pel = pel;
    }
    DOMVirtualParam.prototype.append = function (el, isMove) {
        DOM_1["default"].appendChild(this.pel, el, isMove);
    };
    DOMVirtualParam.prototype.remove = function (el) {
        DOM_1["default"].removeChild(this.pel, el);
    };
    DOMVirtualParam.prototype.insertBefore = function (el, oldEl, isMove) {
        DOM_1["default"].insertChildBefore(this.pel, el, oldEl, isMove);
    };
    return DOMVirtualParam;
}());
exports.DOMVirtualParam = DOMVirtualParam;
function reWriteAction(n, act, fun) {
    var v = n[act];
    if (util_1.isArray(v)) {
        n[act] = fun(v);
    }
    else if (v) {
        n[act] = fun([v]);
    }
    else {
        n[act] = fun([]);
    }
}
exports.reWriteAction = reWriteAction;
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
    if (child.id) {
        child.id(el);
    }
    if (child.action) {
        for (var k in child.action) {
            var v = child.action[k];
            if (util_1.isArray(v)) {
                for (var _i = 0, v_1 = v; _i < v_1.length; _i++) {
                    var vv = v_1[_i];
                    DOM_1["default"].action(el, k, vv);
                }
            }
            else {
                DOM_1["default"].action(el, k, v);
            }
        }
    }
    if (child.style) {
        index_1.parseUtil.bindKV(me, child.style, function (k, v) {
            DOM_1["default"].style(el, k, v);
        });
    }
    if (child.attr) {
        index_1.parseUtil.bindKV(me, child.attr, function (k, v) {
            DOM_1["default"].attr(el, k, v);
        });
    }
    if (child.prop) {
        index_1.parseUtil.bindKV(me, child.prop, function (k, v) {
            DOM_1["default"].prop(el, k, v);
        });
    }
    if (child.cls) {
        index_1.parseUtil.bind(me, child.cls, function (v) {
            DOM_1["default"].attr(el, "class", v);
        });
    }
    if (child.text) {
        index_1.parseUtil.bind(me, child.text, function (v) {
            DOM_1["default"].content(el, v);
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
            DOM_1["default"].value(el, v);
        });
    }
}
exports.dom = index_1.buildElementOrginal(function (me, n, life) {
    if (typeof (n) == 'string') {
        var txt = DOM_1["default"].createTextNode(n);
        if (life) {
            return { element: txt, init: life.init, destroy: life.destroy };
        }
        else {
            return { element: txt, init: null, destroy: null };
        }
    }
    else {
        var element = DOM_1["default"].createElement(n.type);
        var out = util_1.BuildResultList.init();
        var ci = buildParam(me, element, n);
        if ('children' in n) {
            var children = n.children;
            if (children) {
                out.push(childrenBuilder_1.childrenBuilder(me, new DOMVirtualParam(element), children));
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
    var element = DOM_1["default"].createElementNS(n.type, "http://www.w3.org/2000/svg");
    var ci = buildParam(me, element, n);
    if ('children' in n) {
        var children = n.children;
        if (children) {
            out.push(childrenBuilder_1.childrenBuilder(me, new DOMVirtualParam(element), children));
        }
    }
    buildParamAfter(me, element, n);
    out.push(ci);
    return element;
});
