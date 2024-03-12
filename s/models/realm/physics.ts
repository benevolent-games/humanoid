
import {Scene} from "@babylonjs/core/scene.js"
import {Physics, Rapier, debug_colors} from "@benev/toolbox"

export class HuPhysics extends Physics {
	constructor({scene, hertz, colors}: {
			scene: Scene
			hertz: number
			colors: ReturnType<typeof debug_colors>
		}) {
		super({hertz, scene, colors, gravity: [0, -9.81, 0]})
	}

	readonly groups = (() => {
		const {all} = this.grouper
		const [standard, level, dynamic, capsule, sensor] = this.grouper.list()
		return {all, standard, level, dynamic, capsule, sensor}
	})()

	readonly level_trimesh_colliders = new Set<Rapier.Collider>()
}

