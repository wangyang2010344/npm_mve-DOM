

interface ScrollKeep{
	top:number;
	left:number;
	el:Element;
}
function findScroll(el:Element,store:ScrollKeep[]){
	if(el.scrollTop!=0 || el.scrollLeft!=0){
		const keep={
			el:el,
			top:el.scrollTop,
			left:el.scrollLeft
		};
		store.push(keep)
	}
	for(let i=0;i<el.children.length;i++){
		findScroll(el.children[i],store);
	}
}
function keepScroll(el:Element){
	const store:ScrollKeep[]=[];
	findScroll(el,store);
	return store;
}
function reverScroll(store:ScrollKeep[]){
	for(const scrollKeep of store){
		scrollKeep.el.scrollTop=scrollKeep.top
		scrollKeep.el.scrollLeft=scrollKeep.left
	}
}

function notEqual(a:string,b){
	return a!=b || (typeof(b)!="string" && a!=b+"")
}
function isKey(v:number,key:string,code?:string){
	if(code){
		return function(e:KeyboardEvent){
			return (e.keyCode==v || e.key==key) && e.code==code
		}
	}else{
		return function(e:KeyboardEvent){
			return e.keyCode==v || e.key==key
		}
	}
}
/**保存如滚动之类，在从DOM上剪切移动之前 */
export const saveBeforeMove=keepScroll
/**恢复如滚动之类，在从DOM上剪切移动之后 */
export const revertAfterMove=reverScroll
export const keyCode={
	BACKSPACE:isKey(8,"Backspace"),
	ENTER:isKey(13,"Enter"),
	TAB:isKey(9,"Tab"),
	ESCAPE:isKey(27,"Escape"),
	CAPSLOCK:isKey(20,'CapsLock'),

	ARROWLEFT:isKey(37,"ArrowLeft"),
	ARROWUP:isKey(38,"ArrowUp"),
	ARROWRIGHT:isKey(39,"ArrowRight"),
	ARROWDOWN:isKey(40,"ArrowDown"),

	CONTROL:isKey(17,"Control"),

	/**shift键 */
	SHIFT:isKey(16,'Shift'),
	SHIFTLEFT:isKey(16,'Shift','ShiftLeft'),
	SHIFTRIGHT:isKey(16,'Shift','ShiftRight'),

	/**windows键 */
	META:isKey(91,"Meta"),
	METALEFT:isKey(91,"Meta","MetaLeft"),
	METARIGHT:isKey(91,"Meta","MetaRight"),

	/**ALT键 */
	ALT:isKey(18,"Alt"),
	ALTLEFT:isKey(18,"Alt","AltLeft"),
	ALTRIGHT:isKey(18,"Alt","AltRight"),


	A:isKey(65,'a'),
	Z:isKey(90,"z"),
	V:isKey(86,"v"),
	C:isKey(67,"c"),
	X:isKey(88,"x")
}
export function createElement(type:string){
	return document.createElement(type);
}
export function createElementNS(type,NS){
	return document.createElementNS(NS,type);
}
export function createTextNode(json){
	return document.createTextNode(json);
}
export function appendChild(el,child,isMove?:boolean){
	if(isMove){
		const o=keepScroll(child)
		el.appendChild(child);
		reverScroll(o);
	}else{
		el.appendChild(child);
	}
}
export function replaceWith(el,newEL){
	var pN=el.parentNode;
	if(pN){
		pN.replaceChild(newEL,el);
	}
}
function prefix(el:Node,child:Node) {
	const first=el.firstChild
	if(first){
		el.insertBefore(child,first)
	}else{
		el.appendChild(child)
	}
}
export function prefixChild(el,child,isMove?:boolean) {
	if(isMove){
		const o=keepScroll(child)
		prefix(el,child);
		reverScroll(o);
	}else{
		prefix(el,child);
	}
}
function insertAfter(pel:Node,new_el:Node,old_el:Node) {
	const next=old_el.nextSibling
	if(next){
		pel.insertBefore(new_el,next)
	}else{
		pel.appendChild(new_el)
	}
}
export function insertChildAfter(pel,new_el,old_el,isMove?:boolean) {
	if(isMove){
		const oo=keepScroll(old_el)
		const no=keepScroll(new_el);
		insertAfter(pel,new_el,old_el);
		reverScroll(oo)
		reverScroll(no)
	}else{
		insertAfter(pel,new_el,old_el);
	}
}
export function insertChildBefore(pel,new_el,old_el,isMove?:boolean){
	if(isMove){
		const oo=keepScroll(old_el)
		const no=keepScroll(new_el);
		pel.insertBefore(new_el,old_el);
		reverScroll(oo)
		reverScroll(no)
	}else{
		pel.insertBefore(new_el,old_el);
	}
}
export function removeChild(el,child){
	el.removeChild(child);
}
export function empty(el){
	while(el.firstChild){
		el.removeChild(el.firstChild);
	}
}
export function attr(el,key,value){
	const attr=el.getAttribute(key)
	if(notEqual(attr,value)){
		if(value==undefined){
			el.removeAttribute(key);
		}else{
			el.setAttribute(key,value);
		}
	}
}
export function style(el,key,value){
	//IE下如果设置负值，会导致错误
	try{
		if(notEqual(el.style[key],value)){
			el.style[key]=value;
		}
	}catch(e){
		console.warn(e);
	}
}
export function prop(el,key,value){  
	if(notEqual(el[key],value)) {
		el[key]=value;
	}             
}
export function event(el,key,value){
	if(typeof(value)=="function"){
		el.addEventListener(key,value)
	}else
	if(value){
		el.addEventListener(key,value.handler,value)
	}
}
export function text(el,value){
	if(notEqual(el.innerText,value)){
		el.innerText=value;
	}
}
export function content(el,value){
	if(notEqual(el.textContent,value)){
		el.textContent=value;
	}
}
export function value(el,value){
	if(notEqual(el.value,value)){
		el.value=value;
	}
}
export function html(el,value) {
	if(notEqual(el.innerHTML,value)){
		el.innerHTML=value;
	}
}