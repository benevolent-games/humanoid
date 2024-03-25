
import {Selector, CParams} from "@benev/toolbox"

export type Pair<Sel extends Selector> = [Sel, CParams<Sel>]

export function select<Sel extends Selector>(sel: Sel) {
	return sel
}

export function arch<
		Sel extends Selector,
		Fn extends (...args: any[]) => CParams<Sel>,
	>(selector: Sel, fn: Fn) {
	return (...p: Parameters<Fn>) => ([selector, fn(...p)] as Pair<Sel>)
}

export function params<Sel extends Selector>([,params]: Pair<Sel>) {
	return params
}

// TODO utilize an archetype class like this instead of juggling around pairs?
export class Archetype<Sel extends Selector> {
	constructor(
		public selector: Sel,
		public params: CParams<Sel>,
	) {}

	combine<Sel2 extends Selector>(selector2: Sel2, params2: CParams<Sel2>) {
		return new Archetype<Sel2 & Sel>(
			{...this.selector, ...selector2} as Sel2 & Sel,
			{...this.params, ...params2} as CParams<Sel2 & Sel>,
		)
	}
}

