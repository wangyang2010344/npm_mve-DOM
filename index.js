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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsNERBQXFFO0FBQ3JFLHdDQUE2RTtBQUM3RSxzQ0FBbUY7QUFFbkYseUNBQTRCO0FBQzVCOzs7O0dBSUc7QUFDSDtJQUNDLHlCQUNTLEdBQVE7UUFBUixRQUFHLEdBQUgsR0FBRyxDQUFLO0lBQ2YsQ0FBQztJQUNILGdDQUFNLEdBQU4sVUFBTyxFQUFPLEVBQUMsTUFBZTtRQUM3QixHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3BDLENBQUM7SUFDRCxnQ0FBTSxHQUFOLFVBQU8sRUFBTztRQUNiLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxFQUFFLENBQUMsQ0FBQTtJQUM3QixDQUFDO0lBQ0Qsc0NBQVksR0FBWixVQUFhLEVBQU8sRUFBQyxLQUFVLEVBQUMsTUFBZTtRQUM5QyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsS0FBSyxFQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ2hELENBQUM7SUFDRixzQkFBQztBQUFELENBQUMsQUFiRCxJQWFDO0FBYlksMENBQWU7QUFjNUI7SUFDQyxnQ0FDUyxHQUFRO1FBQVIsUUFBRyxHQUFILEdBQUcsQ0FBSztJQUNmLENBQUM7SUFDSCx1Q0FBTSxHQUFOLFVBQU8sQ0FBTztRQUNiLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQTtJQUM1QixDQUFDO0lBQ0QsdUNBQU0sR0FBTixVQUFPLENBQU8sRUFBRSxNQUFnQjtRQUMvQixHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ25D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