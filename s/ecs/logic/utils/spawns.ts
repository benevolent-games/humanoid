
import {Ecs} from "@benev/toolbox"
import {SpawnIntent} from "../../schema/schema.js"

export function blank_spawn_intent(): Ecs.ComponentState<SpawnIntent> {
	return {
		respawn: false,
		bot_spawn: false,
		bot_delete: false,
		switch_to_player: false,
		switch_to_spectator: false,
	}
}

