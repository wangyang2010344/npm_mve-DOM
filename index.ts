
import { EOChildren,childrenBuilder } from "mve-core/childrenBuilder"
import { buildElement, buildElementOrginal, parseUtil } from "mve-core/index"
import { BuildResult, BuildResultList, mve, onceLife,isArray } from "mve-core/util"
import { VirtualChildParam } from "mve-core/virtualTreeChildren"
import * as DOM from "./DOM"
/**
 * 在DOM里，移动其实是少用的
 * 比如窗口，使用z-index的方式，不使用移动
 * 别的表格拖拽，似乎更是根据模型在相应区域重新生成视图
 */
export class DOMVirtualParam implements VirtualChildParam<Node>{
	constructor(
		private pel:Node
	){}
	append(el:Node,isMove: boolean){
		DOM.appendChild(this.pel,el,isMove)
	}
	remove(el:Node){
		DOM.removeChild(this.pel,el)
	}
	insertBefore(el:Node,oldEl:Node,isMove: boolean){
		DOM.insertChildBefore(this.pel,el,oldEl,isMove)
	}
}
export class DOMVirtualParamReverse implements VirtualChildParam<Node>{
	constructor(
		private pel:Node
	){}
	remove(e: Node): void {
		DOM.removeChild(this.pel,e)
	}
	append(e: Node, isMove?: boolean): void {
		DOM.prefixChild(this.pel,e,isMove)
	}
	insertBefore(e: Node, old: Node, isMove?: boolean): void {
		DOM.insertChildAfter(this.pel,e,old,isMove)
	}
}

export type StringValue=mve.MTValue<string>
export type ItemValue=mve.MTValue<string|number|boolean>
export type AttrMap={[key:string]:ItemValue}
export type PropMap={ [key: string]:mve.MTValue<string|number|boolean>}
export type StyleMap={[key:string]:mve.MTValue<string|number>}
export type EventHandler=(e: any) => void
/**动作树 */
export type EventItem=EventHandler | {
	capture?:boolean
	handler:EventHandler
} | EventItem[]
export type EventMap = { [key:string]: EventItem }
export function reWriteEvent(n:EventMap,eventName:string,fun:(vs:EventItem[])=>EventItem[]){
	const v=n[eventName]
	if(isArray(v)){
		n[eventName]=fun(v)
	}else
	if(v){
		n[eventName]=fun([v])
	}else{
		n[eventName]=fun([])
	}
}




type InitFun=(v: any,me:mve.LifeModel)=>void
export function reWriteInit(v:DOMNode,fun:(vs:InitFun[])=>InitFun[]){
	if(isArray(v.init)){
		v.init=fun(v.init)
	}else
	if(v.init){
		v.init=fun([v.init])
	}else{
		v.init=fun([])
	}
}

type DestoryFun=(v: any)=>void
export function reWriteDestroy(v:DOMNode,fun:(vs:DestoryFun[])=>DestoryFun[]){
	if(isArray(v.destroy)){
		v.destroy=fun(v.destroy)
	}else
	if(v.destroy){
		v.destroy=fun([v.destroy])
	}else{
		v.destroy=fun([])
	}
}
export interface DOMNode{
	type:string
	init?:InitFun|InitFun[]
	destroy?:DestoryFun|DestoryFun[]
	id?:StringValue
	cls?:StringValue
	attr?: AttrMap
	style?: StyleMap
	prop?:PropMap
	event?: EventMap

	value?: ItemValue
	children?:EOChildren<Node>
	text?: ItemValue
	childrenReverse?:boolean
}
export type DOMNodeAll=DOMNode|string

function buildParam(me:mve.LifeModel,el:Node,child:DOMNode){
	if(child.event){
		for(const k in child.event){
			const v=child.event[k]
			if(isArray(v)){
				for(const vv of v){
					DOM.event(el,k,vv)
				}
			}else{
				DOM.event(el,k,v)
			}
		}
	}
	if(child.style){
		parseUtil.bindKV(me,child.style,function(k,v){
			DOM.style(el,k,v)
		})
	}
	if(child.attr){
		parseUtil.bindKV(me,child.attr,function(k,v){
			DOM.attr(el,k,v)
		})
	}
	if(child.prop){
		parseUtil.bindKV(me,child.prop,function(k,v){
			DOM.prop(el,k,v)
		})
	}
	if(child.cls){
		parseUtil.bind(me,child.cls,function(v){
			DOM.attr(el,"class",v)
		})
	}
	if(child.id){
		parseUtil.bind(me,child.id,function(v){
			DOM.attr(el,"id",v)
		})
	}
	if(child.text){
		parseUtil.bind(me,child.text,function(v){
			DOM.content(el,v)
		})
	}
	const ci:BuildResult={}
	if(child.init){
		if(isArray(child.init)){
			const inits=child.init
			for(let init of inits){
				init(el,me)
			}
		}else{
			const init=child.init
			ci.init=function(){
				init(el,me)
			}
		}
	}
	if(child.destroy){
		if(isArray(child.destroy)){
			const destroys=child.destroy
			ci.destroy=function(){
				for(let destroy of destroys){
					destroy(el)
				}
			}
		}else{
			const destroy=child.destroy
			ci.destroy=function(){
				destroy(el)
			}
		}
	}
	return ci
}
function buildParamAfter(me:mve.LifeModel,el:Node,child:DOMNode){
	/**
	 * value必须在Attr后面才行，不然type=range等会无效
	 * select的value必须放在children后，不然会无效
	 */
	if(child.value){
		parseUtil.bind(me,child.value,function(v){
			DOM.value(el,v)
		})
	}
}
export const dom=buildElementOrginal<DOMNodeAll,Node>(function(me,n,life){
	if(typeof(n)=='string'){
		const txt=DOM.createTextNode(n)
		if(life){
			return {element:txt,init:life.init,destroy:life.destroy}
		}else{
			return {element:txt,init:null,destroy:null}
		}
	}else{
		const element=DOM.createElement(n.type)
		const out=BuildResultList.init()
		const ci=buildParam(me,element,n)
		if('children' in n){
			const children=n.children
			if(children){
				const virtualParam=n.childrenReverse?new DOMVirtualParamReverse(element):new DOMVirtualParam(element)
				out.push(childrenBuilder(me,virtualParam,children))
			}
		}
		buildParamAfter(me,element,n)
		out.push(ci)
		if(life){
			out.push(life)
		}
		return onceLife(out.getAsOne(element)).out
	}
})
export const svg=buildElement<DOMNode,Node>(function(me,n,out){
	const element=DOM.createElementNS(n.type,"http://www.w3.org/2000/svg")
	const ci=buildParam(me,element,n)
	if('children' in n){
		const children=n.children
		if(children){
			const virtualParam=n.childrenReverse?new DOMVirtualParamReverse(element):new DOMVirtualParam(element)
			out.push(childrenBuilder(me,virtualParam,children))
		}
	}
	buildParamAfter(me,element,n)
	out.push(ci)
	return element
})

let idCount=0
/**生成唯一ID*/
export function idOf(name:string){
	return name+(idCount++)
}
let clsCount=0
/**生成唯一class */
export function clsOf(name:string){
	return name+(clsCount++)
}