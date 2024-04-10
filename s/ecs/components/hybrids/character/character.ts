
import {Meshoid, Prop, Trashcan, Vec3, nametag, nquery} from "@benev/toolbox"

import {HybridComponent} from "../../../hub.js"
import {Weapon} from "../../../../models/armory/weapon.js"
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
		// const {scene} = this.realm

		// const referenceWeapon = this.weapons.right.get("reference")!
		const weapons = [...this.weapons.right].filter(([name]) => name !== "reference")

		// const protoRibbons = new Map<Weapon.Name, Weapon.ProtoRibbon>()

		for (const [name, mesh] of weapons) {
			// console.log("WEAPON", name)
			const props = [...mesh.getChildMeshes(), ...mesh.getChildTransformNodes()] as Prop[]

			const physics = props.filter(p => nquery(p).name("physics"))
			const guides = props.filter(p => nquery(p).tag("ribbon"))
			const nearcaps = props.filter(p => nquery(p).name("near"))

			// props.forEach(p => console.log("  - ", p.name))
			physics.forEach(mesh => mesh.dispose())
			guides.forEach(mesh => mesh.dispose())
			nearcaps.forEach(mesh => mesh.dispose())
		}

		return {}
	})()

	created() {}
	updated() {}
	deleted() {
		this.parts.dispose()
		this.coordination.dispose()
	}
}

