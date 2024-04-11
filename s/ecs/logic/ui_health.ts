
import {behavior, responder, system} from "../hub.js"
import {Health, Stamina} from "../components/topics/warrior.js"
import {Controllable} from "../components/plain_components.js"

export const ui_health = system("health ui", ({realm}) => [

	responder("show and hide health ui")
		.select({Controllable, Health})
		.respond(() => {
			realm.ui.health.enabled = true
			return () => realm.ui.health.enabled = false
		}),

	behavior("send health values to the ui")
		.select({Controllable, Health})
		.logic(() => ({components: {health}}) => {
			realm.ui.health.hp = health.hp
			realm.ui.health.bleed = health.bleed
		}),

	behavior("send stamina values while we're at it")
		.select({Controllable, Stamina})
		.logic(() => ({components: {stamina}}) => {
			realm.ui.health.stamina = stamina.juice
		}),
])

