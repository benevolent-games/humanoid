
import {Selector, ComponentParams} from "@benev/toolbox/x/ecs/ecs5.js"

export type Pair<Sel extends Selector> = [Sel, ComponentParams<Sel>]

export function select<Sel extends Selector>(sel: Sel) {
	return sel
}

export function arch<Sel extends Selector, Fn extends (...args: any[]) => ComponentParams<Sel>>(selector: Sel, fn: Fn) {
	return (...p: Parameters<Fn>) => ([selector, fn(...p)] as Pair<Sel>)
}

export function params<Sel extends Selector>([,params]: Pair<Sel>) {
	return params
}

