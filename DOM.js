"use strict";
exports.__esModule = true;
exports.html = exports.value = exports.content = exports.text = exports.event = exports.prop = exports.style = exports.attr = exports.empty = exports.removeChild = exports.insertChildBefore = exports.insertChildAfter = exports.prefixChild = exports.replaceWith = exports.appendChild = exports.createTextNode = exports.createElementNS = exports.createElement = exports.keyCode = exports.revertAfterMove = exports.saveBeforeMove = void 0;
function findScroll(el, store) {
    if (el.scrollTop != 0 || el.scrollLeft != 0) {
        var keep = {
            el: el,
            top: el.scrollTop,
            left: el.scrollLeft
        };
        store.push(keep);
    }
    for (var i = 0; i < el.children.length; i++) {
        findScroll(el.children[i], store);
    }
}
function keepScroll(el) {
    var store = [];
    findScroll(el, store);
    return store;
}
function reverScroll(store) {
    for (var _i = 0, store_1 = store; _i < store_1.length; _i++) {
        var scrollKeep = store_1[_i];
        scrollKeep.el.scrollTop = scrollKeep.top;
        scrollKeep.el.scrollLeft = scrollKeep.left;
    }
}
function notEqual(a, b) {
    return a != b || (typeof (b) != "string" && a != b + "");
}
function isKey(v, key, code) {
    if (code) {
        return function (e) {
            return (e.keyCode == v || e.key == key) && e.code == code;
        };
    }
    else {
        return function (e) {
            return e.keyCode == v || e.key == key;
        };
    }
}
/**保存如滚动之类，在从DOM上剪切移动之前 */
exports.saveBeforeMove = keepScroll;
/**恢复如滚动之类，在从DOM上剪切移动之后 */
exports.revertAfterMove = reverScroll;
exports.keyCode = {
    BACKSPACE: isKey(8, "Backspace"),
    ENTER: isKey(13, "Enter"),
    TAB: isKey(9, "Tab"),
    ESCAPE: isKey(27, "Escape"),
    CAPSLOCK: isKey(20, 'CapsLock'),
    ARROWLEFT: isKey(37, "ArrowLeft"),
    ARROWUP: isKey(38, "ArrowUp"),
    ARROWRIGHT: isKey(39, "ArrowRight"),
    ARROWDOWN: isKey(40, "ArrowDown"),
    CONTROL: isKey(17, "Control"),
    /**shift键 */
    SHIFT: isKey(16, 'Shift'),
    SHIFTLEFT: isKey(16, 'Shift', 'ShiftLeft'),
    SHIFTRIGHT: isKey(16, 'Shift', 'ShiftRight'),
    /**windows键 */
    META: isKey(91, "Meta"),
    METALEFT: isKey(91, "Meta", "MetaLeft"),
    METARIGHT: isKey(91, "Meta", "MetaRight"),
    /**ALT键 */
    ALT: isKey(18, "Alt"),
    ALTLEFT: isKey(18, "Alt", "AltLeft"),
    ALTRIGHT: isKey(18, "Alt", "AltRight"),
    A: isKey(65, 'a'),
    Z: isKey(90, "z"),
    V: isKey(86, "v"),
    C: isKey(67, "c"),
    X: isKey(88, "x")
};
function createElement(type) {
    return document.createElement(type);
}
exports.createElement = createElement;
function createElementNS(type, NS) {
    return document.createElementNS(NS, type);
}
exports.createElementNS = createElementNS;
function createTextNode(json) {
    return document.createTextNode(json);
}
exports.createTextNode = createTextNode;
function appendChild(el, child, isMove) {
    if (isMove) {
        var o = keepScroll(child);
        el.appendChild(child);
        reverScroll(o);
    }
    else {
        el.appendChild(child);
    }
}
exports.appendChild = appendChild;
function replaceWith(el, newEL) {
    var pN = el.parentNode;
    if (pN) {
        pN.replaceChild(newEL, el);
    }
}
exports.replaceWith = replaceWith;
function prefix(el, child) {
    var first = el.firstChild;
    if (first) {
        el.insertBefore(child, first);
    }
    else {
        el.appendChild(child);
    }
}
function prefixChild(el, child, isMove) {
    if (isMove) {
        var o = keepScroll(child);
        prefix(el, child);
        reverScroll(o);
    }
    else {
        prefix(el, child);
    }
}
exports.prefixChild = prefixChild;
function insertAfter(pel, new_el, old_el) {
    var next = old_el.nextSibling;
    if (next) {
        pel.insertBefore(new_el, next);
    }
    else {
        pel.appendChild(new_el);
    }
}
function insertChildAfter(pel, new_el, old_el, isMove) {
    if (isMove) {
        var oo = keepScroll(old_el);
        var no = keepScroll(new_el);
        insertAfter(pel, new_el, old_el);
        reverScroll(oo);
        reverScroll(no);
    }
    else {
        insertAfter(pel, new_el, old_el);
    }
}
exports.insertChildAfter = insertChildAfter;
function insertChildBefore(pel, new_el, old_el, isMove) {
    if (isMove) {
        var oo = keepScroll(old_el);
        var no = keepScroll(new_el);
        pel.insertBefore(new_el, old_el);
        reverScroll(oo);
        reverScroll(no);
    }
    else {
        pel.insertBefore(new_el, old_el);
    }
}
exports.insertChildBefore = insertChildBefore;
function removeChild(el, child) {
    el.removeChild(child);
}
exports.removeChild = removeChild;
function empty(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}
exports.empty = empty;
function attr(el, key, value) {
    var attr = el.getAttribute(key);
    if (notEqual(attr, value)) {
        if (value == undefined) {
            el.removeAttribute(key);
        }
        else {
            el.setAttribute(key, value);
        }
    }
}
exports.attr = attr;
function style(el, key, value) {
    //IE下如果设置负值，会导致错误
    try {
        if (notEqual(el.style[key], value)) {
            el.style[key] = value;
        }
    }
    catch (e) {
        console.warn(e);
    }
}
exports.style = style;
function prop(el, key, value) {
    if (notEqual(el[key], value)) {
        el[key] = value;
    }
}
exports.prop = prop;
function event(el, key, value) {
    if (typeof (value) == "function") {
        el.addEventListener(key, value);
    }
    else if (value) {
        el.addEventListener(key, value.handler, value);
    }
}
exports.event = event;
function text(el, value) {
    if (notEqual(el.innerText, value)) {
        el.innerText = value;
    }
}
exports.text = text;
function content(el, value) {
    if (notEqual(el.textContent, value)) {
        el.textContent = value;
    }
}
exports.content = content;
function value(el, value) {
    if (notEqual(el.value, value)) {
        el.value = value;
    }
}
exports.value = value;
function html(el, value) {
    if (notEqual(el.innerHTML, value)) {
        el.innerHTML = value;
    }
}
exports.html = html;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRE9NLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiRE9NLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQU9BLFNBQVMsVUFBVSxDQUFDLEVBQVUsRUFBQyxLQUFrQjtJQUNoRCxJQUFHLEVBQUUsQ0FBQyxTQUFTLElBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLElBQUUsQ0FBQyxFQUFDO1FBQ3RDLElBQU0sSUFBSSxHQUFDO1lBQ1YsRUFBRSxFQUFDLEVBQUU7WUFDTCxHQUFHLEVBQUMsRUFBRSxDQUFDLFNBQVM7WUFDaEIsSUFBSSxFQUFDLEVBQUUsQ0FBQyxVQUFVO1NBQ2xCLENBQUM7UUFDRixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ2hCO0lBQ0QsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFDO1FBQ3BDLFVBQVUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2pDO0FBQ0YsQ0FBQztBQUNELFNBQVMsVUFBVSxDQUFDLEVBQVU7SUFDN0IsSUFBTSxLQUFLLEdBQWMsRUFBRSxDQUFDO0lBQzVCLFVBQVUsQ0FBQyxFQUFFLEVBQUMsS0FBSyxDQUFDLENBQUM7SUFDckIsT0FBTyxLQUFLLENBQUM7QUFDZCxDQUFDO0FBQ0QsU0FBUyxXQUFXLENBQUMsS0FBa0I7SUFDdEMsS0FBd0IsVUFBSyxFQUFMLGVBQUssRUFBTCxtQkFBSyxFQUFMLElBQUssRUFBQztRQUExQixJQUFNLFVBQVUsY0FBQTtRQUNuQixVQUFVLENBQUMsRUFBRSxDQUFDLFNBQVMsR0FBQyxVQUFVLENBQUMsR0FBRyxDQUFBO1FBQ3RDLFVBQVUsQ0FBQyxFQUFFLENBQUMsVUFBVSxHQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUE7S0FDeEM7QUFDRixDQUFDO0FBRUQsU0FBUyxRQUFR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