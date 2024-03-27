
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {Rapier, Trashcan, Vec3, babylonian, label, vec3} from "@benev/toolbox"

import {HybridComponent} from "../../../hub.js"
import {HuRealm} from "../../../../models/realm/realm.js"
import {establish_anim_coordination} from "./choreography/establish_anim_coordination.js"
import {prepare_choreographer_babylon_parts} from "./choreography/prepare_choreographer_babylon_parts.js"

export class Character extends HybridComponent<{height: number}> {

	readonly parts = prepare_choreographer_babylon_parts(
		this.realm.scene,
		this.realm.character.instance(),
		this.state.height,
	)

	readonly coordination = establish_anim_coordination(
		this.realm,
		this.parts.character,
		name => console.warn(`missing character animation "${name}"`),
	)

	readonly helpers = (() => {
		const {scene} = this.realm
		const {sword} = this.parts
		const trash = new Trashcan()

		const swordlength = 1.2

		const swordtip = trash.bag(
			new TransformNode(label("swordtip"), scene)
		).dump(t => t.dispose())
		swordtip.parent = sword
		swordtip.position.set(0, 0, swordlength)

		// const swordtip_visualizer = trash.bag(
		// 	MeshBuilder.CreateIcoSphere(
		// 		label("swordtipvis"),
		// 		{radius: 0.05, subdivisions: 1},
		// 		scene,
		// 	)
		// ).dump(m => m.dispose())
		// swordtip_visualizer.material = colors.magenta
		// swordtip_visualizer.parent = swordtip

		const swordbase = trash.bag(
			new TransformNode(label("swordbase"), scene)
		).dump(t => t.dispose())
		swordbase.parent = sword
		swordbase.position.set(0, 0, 0)

		// const swordbase_visualizer = trash.bag(
		// 	MeshBuilder.CreateIcoSphere(
		// 		label("swordbasevis"),
		// 		{radius: 0.05, subdivisions: 1},
		// 		scene,
		// 	)
		// ).dump(m => m.dispose())
		// swordbase_visualizer.material = colors.green
		// swordbase_visualizer.parent = swordbase

		return {swordbase, swordtip, dispose: trash.dispose}

		// const s = .36805
		// const scale: Vec3 = [.1, 4, .1]
		// const [width, height, depth] = scale

		// const swordproxy = trash.bag(
		// 	MeshBuilder.CreateBox(
		// 		label("swordproxy"),
		// 		{width, height, depth},
		// 		scene,
		// 	)
		// ).dump(m => m.dispose())
		// swordproxy.material = physics.colors.red
		// swordproxy.position.y = -1.5
		// swordproxy.parent = sword
		// swordproxy.visibility = 0.5

		// const box = trash.bag(
		// 	physics.prefabs.box_collider({
		// 		density: 0,
		// 		sensor: true,
		// 		material: physics.colors.green,
		// 		scale: vec3.multiplyBy(scale, s),
		// 		position: babylonian.to.vec3(swordproxy.absolutePosition),
		// 		rotation: babylonian.ascertain.absoluteQuat(swordproxy),
		// 		contact_force_threshold: 0.02,
		// 		groups: physics.grouper.specify({
		// 			filter: [physics.grouper.all],
		// 			membership: [physics.groups.sensor],
		// 		}),
		// 	})
		// ).dump(b => b.dispose())
		// box.collider.setActiveEvents(Rapier.ActiveEvents.COLLISION_EVENTS)

		// return {
		// 	box,
		// 	swordtip,
		// 	swordproxy,
		// 	dispose: trash.dispose,
		// }
	})()

	created() {}
	updated() {}
	deleted() {
		this.parts.dispose()
		this.coordination.dispose()
		this.helpers.dispose()
	}
}

