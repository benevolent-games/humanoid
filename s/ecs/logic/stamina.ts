
import {scalar} from "@benev/toolbox"

import {behavior, system} from "../hub.js"
import {Melee} from "../../models/attacking/melee.js"
import {Intent} from "../components/plain_components.js"
import {MeleeAction, Stamina} from "../components/topics/warrior.js"

export const stamina = system("stamina mechanics", () => [

	behavior("attacks drain stamina, literally by attack time")
		.select({Stamina, MeleeAction})
		.logic(({seconds}) => ({components: {stamina, meleeAction}}) => {
			if (Melee.is.attack(meleeAction)) {
				stamina.juice = scalar.clamp(stamina.juice - (seconds / 10))
			}
		}),

	behavior("stamina regeneration")
		.select({Stamina, MeleeAction, Intent})
		.logic(({seconds}) => ({components: {stamina, meleeAction, intent}}) => {
			const isBusy = (
				Melee.is.attack(meleeAction) ||
				Melee.is.parry(meleeAction) ||
				intent.fast
			)
			if (!isBusy && stamina.juice < 1) {
				stamina.juice = scalar.clamp(stamina.juice + (seconds / 20))
			}
		}),
])

