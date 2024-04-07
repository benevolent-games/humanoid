
import {Meshoid, Trashcan, label, nametag} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {HybridComponent} from "../../../hub.js"
import {Nametag} from "../../../../tools/nametag.js"
import {establish_anim_coordination} from "./choreography/establish_anim_coordination.js"
import {ContainerInstance} from "../../../../models/glb_post_processing/container_instance.js"
import {prepare_character_component_parts} from "./choreography/prepare_character_component_parts.js"

export class Character extends HybridComponent<{height: number}> {

	readonly parts = prepare_character_component_parts(
		this.realm.scene,
		new ContainerInstance(this.realm.characterContainer),
		this.state.height,
	)

	readonly coordination = establish_anim_coordination(
		this.realm,
		this.parts.character,
		name => console.warn(`missing character animation "${name}"`),
	)

	readonly weapons = (() => {
		const left = new Map<string, Meshoid>()
		const right = new Map<string, Meshoid>()
		for (const mesh of this.parts.character.meshes.values()) {
			const parsed = nametag(mesh.name)
			if (parsed.has("weapon")) {
				mesh.isVisible = false
				if (parsed.get("weapon") === "right")
					right.set(parsed.name, mesh)
				else
					left.set(parsed.name, mesh)
			}
		}
		return {left, right}
	})()

	readonly helpers = (() => {
		const {scene} = this.realm
		// const {sword} = this.weapons
		const trash = new Trashcan()

		// const swordlength = 1.2

		// const swordtip = trash.bag(
		// 	new TransformNode(label("swordtip"), scene)
		// ).dump(t => t.dispose())
		// swordtip.parent = sword
		// swordtip.position.set(0, 0, swordlength)

		// const swordbase = trash.bag(
		// 	new TransformNode(label("swordbase"), scene)
		// ).dump(t => t.dispose())
		// swordbase.parent = sword
		// swordbase.position.set(0, 0, 0)

		return {
			// swordbase, swordtip,
			dispose: trash.dispose,
		}
	})()

	created() {}
	updated() {}
	deleted() {
		this.parts.dispose()
		this.coordination.dispose()
		this.helpers.dispose()
	}
}

