
import {Granularity} from "../../utils/granularity.js"

export type Primitive = number | boolean
export const ColorInput = Symbol()

export type InputGroup<G extends Record<string, any>> = {
	[K in keyof G]: (
		G[K] extends number ? [typeof Number, Granularity] :
		G[K] extends boolean ? [typeof Boolean] :
		[typeof ColorInput]
	)
}

