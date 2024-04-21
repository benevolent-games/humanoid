
import {ob} from "@benev/slate"
import {Vec2, scalar} from "@benev/toolbox"

const {degrees} = scalar.radians.from

export const allowed = degrees(270)
export const forbidden = degrees(360) - allowed
export const halfForbidden = forbidden / 2

export const splines = (
	ob({

		/*
		## angles expressed as sixteenths of a circle
		##     -1  0  1
		##       \ | /
		##  -4 ————O———— 4
		##       / | \
		##     -7  8  7
		*/

		// right side
		a2: [0, 1, 4],
		a3: [1, 4, 7],
		a4: [4, 7, 8],

		// left side
		a1: [0, -1, -4],
		a6: [-1, -4, -7],
		a5: [-4, -7, -8],
	})
	.map(
		values => values
			.sort((a, b) => a - b)

			// convert circle-sixteenths into radians
			.map(x => scalar.radians.from.turns(x / 16))

			// spline point ramping from 0, to 1, back to 0
			.map((v, index) => [v, index === 1 ? 1 : 0] as Vec2)
	)
)

export const zones = {
	left: [
		-scalar.radians.from.turns(1 / 16),
		-scalar.radians.from.turns(7 / 16),
	] as Vec2,
	right: [
		scalar.radians.from.turns(1 / 16),
		scalar.radians.from.turns(7 / 16),
	] as Vec2,
}

