
// import {CState, spline} from "@benev/toolbox"
// import {inverse} from "@benev/toolbox/x/math/scalar.js"

// import {Attackage} from "../../../schema.js"
// import {attackReport} from "../../../../../models/attacking/report.js"
// import {defaultWeapon} from "../../../../../models/attacking/weapons.js"

// export function attackCoaching(
// 		attackage: CState<Attackage>,
// 	) {

// 	const attack = attackage.technique === null
// 		? null
// 		: attackReport({
// 			weapon: defaultWeapon,
// 			seconds: attackage.seconds,
// 			technique: attackage.technique,
// 		})

// 	let attacking = 0

// 	if (attack) {
// 		const blendtime = 0.1
// 		const [a, _b, c, d] = attack.milestones
// 		attacking = spline.linear(attackage.seconds, [
// 			[a, 0],
// 			[a + blendtime, 1],
// 			[c + blendtime, 1],
// 			[d + blendtime, 0],
// 		])
// 	}

// 	return {
// 		attacking,
// 		notAttacking: inverse(attacking),
// 	}
// }

