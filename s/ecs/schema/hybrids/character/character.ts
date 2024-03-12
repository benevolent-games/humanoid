
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {HybridComponent, Rapier, Vec3, babylonian, label, vec3} from "@benev/toolbox"

import {HuRealm} from "../../../../models/realm/realm.js"
import {establish_anim_coordination} from "./choreography/establish_anim_coordination.js"
import {prepare_choreographer_babylon_parts} from "./choreography/prepare_choreographer_babylon_parts.js"

export class Character extends HybridComponent<HuRealm, {
		height: number
	}> {

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
		const {sword} = this.parts
		const {physics, scene} = this.realm

		const swordtip = new TransformNode(label("sword-tip"))
		swordtip.parent = sword
		swordtip.position.set(0, -3.3, 0)
		sword.visibility = 0.5

		const s = .36805
		const scale: Vec3 = [.1, 4, .1]
		const [width, height, depth] = scale

		const swordproxy = MeshBuilder.CreateBox(
			label("swordproxy"),
			{width, height, depth},
			scene,
		)
		swordproxy.material = physics.colors.red
		swordproxy.position.y = -1.5
		swordproxy.parent = sword
		swordproxy.visibility = 0.5

		const box = physics.prefabs.box_collider({
			density: 0,
			sensor: true,
			material: physics.colors.green,
			scale: vec3.multiplyBy(scale, s),
			position: babylonian.to.vec3(swordproxy.absolutePosition),
			rotation: babylonian.ascertain.absoluteQuat(swordproxy),
			contact_force_threshold: 0.02,
			groups: physics.grouper.specify({
				filter: [physics.grouper.all],
				membership: [physics.groups.sensor],
			}),
		})
		box.collider.setActiveEvents(Rapier.ActiveEvents.COLLISION_EVENTS)

		return {box, swordtip, swordproxy}
	})()

	created() {}
	updated() {}
	deleted() {
		this.parts.dispose()
		this.coordination.dispose()
	}
}

