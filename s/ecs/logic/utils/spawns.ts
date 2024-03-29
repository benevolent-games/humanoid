
import {Ecs, vec2, vec3} from "@benev/toolbox"
import {Spawner} from "../../schema/schema.js"

export function blank_spawner_state(): Ecs.ComponentState<Spawner> {
	return {
		starting_at: {
			gimbal: vec2.zero(),
			position: [0, 5, 0],
		},
		inputs: {
			respawn: false,
			bot_spawn: false,
			bot_delete: false,
			switch_to_player: false,
			switch_to_spectator: false,
		},
	}
}

