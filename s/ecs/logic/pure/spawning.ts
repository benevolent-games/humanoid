
import {system, logic} from "../../hub.js"

export const spawning = system("spawning", [

	logic("spawn buttons", ({realm}) => {
		const {buttons} = realm.tact.inputs.humanoid

		buttons.respawn.onPressed(() => {
			console.log("respawn")
		})

		buttons.bot_spawn.onPressed(() => {
			console.log("bot_spawn")
		})

		buttons.bot_delete.onPressed(() => {
			console.log("bot_delete")
		})
	}),
])

