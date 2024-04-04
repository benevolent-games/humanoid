
import {Trashcan, label} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {HybridComponent} from "../../../hub.js"
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

		const swordbase = trash.bag(
			new TransformNode(label("swordbase"), scene)
		).dump(t => t.dispose())
		swordbase.parent = sword
		swordbase.position.set(0, 0, 0)

		return {swordbase, swordtip, dispose: trash.dispose}
	})()

	created() {}
	updated() {}
	deleted() {
		this.parts.dispose()
		this.coordination.dispose()
		this.helpers.dispose()
	}
}

