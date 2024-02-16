
import {World} from "@benev/toolbox"
import {Cycle} from "../../tools/cycle.js"
import {Loading} from "../../tools/loading.js"
import {HumanoidRealm} from "../realm/realm.js"
import {Skybox} from "../../ecs/schema/hybrids/skybox.js"
import {Envmap} from "../../ecs/schema/hybrids/envmap.js"
import {Level, LevelAsset} from "../../ecs/schema/hybrids/level.js"

export class LevelSwitcher {
	#loading = new Loading()
	#dispose: (() => void) | null = null

	constructor(
		public readonly realm: HumanoidRealm,
		public readonly world: World<HumanoidRealm>,
	) {}

	toggle() {
		if (this.#loading.currently)
			return

		if (this.#dispose) {
			this.#dispose()
			this.#dispose = null
		}

		this.#cycle.grab()()
	}

	#level(asset: LevelAsset) {
		return this.#loading.fn(async() => {
			const {world} = this

			const level = world.createEntity({Level}, {
				level: {asset},
			})

			const skybox = world.createEntity({Skybox}, {
				skybox: {size: 1_000, rotate_degrees: 180},
			})

			const envmap = world.createEntity({Envmap}, {
				envmap: {},
			})

			this.#dispose = () => {
				world.deleteEntity(level.id)
				world.deleteEntity(skybox.id)
				world.deleteEntity(envmap.id)
			}

			await level.data.level.doneLoading
		})
	}

	#cycle = new Cycle([
		this.#level("gym"),
		this.#level("wrynth_dungeon"),
	] as const)
}

