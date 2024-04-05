
import {Scene} from "@babylonjs/core/scene.js"
import {Id, Physics, Rapier, debug_colors} from "@benev/toolbox"

export class HuPhysics extends Physics {
	constructor({scene, colors}: {
			scene: Scene
			colors: ReturnType<typeof debug_colors>
		}) {
		super({scene, colors, gravity: [0, -9.81, 0]})
	}

	readonly groups = (() => {
		const {all} = this.grouper
		const [standard, level, dynamic, capsule, sensor] = this.grouper.list()
		return {all, standard, level, dynamic, capsule, sensor}
	})()

	readonly trimesh_colliders = new Set<Rapier.Collider>()
	readonly dynamics = new Map<Rapier.Collider, {rigid: Rapier.RigidBody}>()
	readonly capsules = new Map<Rapier.Collider, {entityId: Id, rigid: Rapier.RigidBody}>()
}

