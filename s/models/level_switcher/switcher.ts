
import {World} from "@benev/toolbox"
import {HumanoidRealm} from "../realm/realm.js"
import {Level} from "../../ecs/schema/hybrids/level.js"
import {Skybox} from "../../ecs/schema/hybrids/skybox.js"
import {Envmap} from "../../ecs/schema/hybrids/envmap.js"

export class LevelSwitcher {
	#level: ReturnType<typeof spawn_level> | null = null
	constructor(public readonly world: World<HumanoidRealm>) {}

	swap() {
		if (this.#level)
			this.#delete()
		else
			this.#level = spawn_level(this.world)
	}

	#delete() {
		const world = this.world
		const level = this.#level
		if (level) {
			this.#level = null
			world.deleteEntity(level.level.id)
			world.deleteEntity(level.skybox.id)
			world.deleteEntity(level.envmap.id)
		}
	}
}

function spawn_level(world: World<HumanoidRealm>) {
	return {
		level: world.createEntity({Level}, {
			level: {asset: "gym"},
		}),
		skybox: world.createEntity({Skybox}, {
			skybox: {size: 1_000, rotate_degrees: 180},
		}),
		envmap: world.createEntity({Envmap}, {
			envmap: {},
		}),
	}
}

