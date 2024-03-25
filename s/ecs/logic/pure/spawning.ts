
// import {Input} from "@benev/toolbox"
// import {behavior, system} from "../../hub.js"
// import {Controllable, Humanoid, SpawnIntent, Spawned} from "../../schema/schema.js"

// export const spawning = system("spawning", [

// 	behavior("spawn buttons")
// 		.select({Controllable, SpawnIntent, Spawned})
// 		.act(({realm}) => components => {
// 			const isPressed = ({down, repeat}: Input.Button) => (down && !repeat)
// 			const {buttons} = realm.tact.inputs.humanoid
// 			components.spawnIntent.togglePlayer = isPressed(buttons.respawn.input)
// 			components.spawnIntent.spawnBot = isPressed(buttons.bot_spawn.input)
// 			components.spawnIntent.deleteBot = isPressed(buttons.bot_delete.input)
// 		}),

// 	behavior("actually spawn stuff")
// 		.select({Controllable, SpawnIntent, Spawned})
// 		.act(({world, realm}) => components => {
// 			const {togglePlayer, spawnBot, deleteBot} = components.spawnIntent

// 			if (togglePlayer) {
// 				// TODO grab all player entities
// 			}
// 		}),
// ])

