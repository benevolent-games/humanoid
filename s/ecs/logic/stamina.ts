
import {scalar} from "@benev/toolbox"

import {behavior, system} from "../hub.js"
import {Melee} from "../../models/attacking/melee.js"
import {IsSprinting} from "../components/plain_components.js"
import {MeleeAction, Stamina} from "../components/topics/warrior.js"

const regenRate = 2 / 10
const regenWait = 2
const lossFactor = 1 / 8

export const stamina = system("stamina mechanics", () => [

	behavior("attacking drains stamina")
		.select({Stamina, MeleeAction})
		.logic(() => ({components: {stamina, meleeAction}}) => {
			if (Melee.is.attack(meleeAction)) {
				if (stamina.knownMeleeAction !== meleeAction) {
					const {weapon} = meleeAction
					stamina.knownMeleeAction = meleeAction

					const {windup, release, recovery} = weapon.swing.timing
					const stamloss = lossFactor * (windup + release + recovery)

					stamina.juice = scalar.clamp(stamina.juice - stamloss)
				}
			}
		}),

	behavior("sprinting interrupts stamina regen")
		.select({Stamina, IsSprinting})
		.logic(({gametime}) => ({components: {stamina, isSprinting}}) => {
			if (isSprinting)
				stamina.interruptionGametime = gametime
		}),

	behavior("attack or parry interrupts stamina regen")
		.select({Stamina, MeleeAction})
		.logic(({gametime}) => ({components: {stamina, meleeAction}}) => {
			if (Melee.is.attack(meleeAction) || Melee.is.parry(meleeAction))
				stamina.interruptionGametime = gametime
		}),

	behavior("stamina regeneration")
		.select({Stamina})
		.logic(({gametime, seconds}) => ({components: {stamina}}) => {
			const since = gametime - stamina.interruptionGametime
			const regenAllowed = since > regenWait
			if (regenAllowed && stamina.juice < 1) {
				stamina.juice = scalar.clamp(
					stamina.juice + (seconds * regenRate)
				)
			}
		}),
])

