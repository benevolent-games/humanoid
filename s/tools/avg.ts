
import {Vec2, vec2} from "@benev/toolbox"

export const avg = {
	vec2: {
		append(limit: number, array: Vec2[], item: Vec2) {
			array.push(item)
			while (array.length > limit)
				array.shift()
			return array
		},
		average(array: Vec2[]) {
			const sum = array.reduce((p, c) => vec2.add(p, c), vec2.zero())
			return vec2.divideBy(sum, Math.max(1, array.length))
		},
	},
}

