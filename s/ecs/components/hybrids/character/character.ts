
import {Prop, babyloid, nametag, nquery} from "@benev/toolbox"

import {HybridComponent} from "../../../hub.js"
import {Weapon} from "../../../../models/armory/weapon.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
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
		const left = new Map<string, Prop>()
		const right = new Map<string, Prop>()
		for (const prop of this.parts.character.props.values()) {
			const parsed = nametag(prop.name)
			if (parsed.has("weapon")) {
				if (babyloid.is.meshoid(prop))
					prop.isVisible = false
				if (parsed.get("weapon") === "right")
					right.set(parsed.name, prop)
				else
					left.set(parsed.name, prop)
			}
		}
		return {left, right}
	})()

	getWeaponMeta(name: Weapon.Name): Weapon.Meta | null {
		const fn = this.weaponMetas.get(name)
		return fn ? fn() : null
	}

	readonly weaponMetas = (() => {
		const metas = new Map<Weapon.Name, () => Weapon.Meta>()
		const weapons = [...this.weapons.right].filter(([name]) => name !== "reference")

		for (const [name, mesh] of [...weapons]) {
			const props = mesh.getChildren(babyloid.is.prop)
			const physics = props.filter(p => nquery(p).name("physics"))
			const ribbonGuides = props.filter(p => nquery(p).tag("ribbon"))
			const nearcaps = props.filter(p => nquery(p).name("near"))
			const [nearcap] = nearcaps

			metas.set(name as Weapon.Name, () => ({
				nearcap: babyloid.to.vec3(nearcap.getAbsolutePosition()),
				protoRibbons: ribbonGuides.map(prop => {
					const length = prop.scaling.y
					const matrix = prop.computeWorldMatrix(true)
					const a = new Vector3(0, 0, 0)
					const b = new Vector3(0, length, 0)
					return {
						kind: nametag(prop.name).name as Weapon.RibbonKind,
						a: babyloid.to.vec3(Vector3.TransformCoordinates(a, matrix)),
						b: babyloid.to.vec3(Vector3.TransformCoordinates(b, matrix)),
					}
				}),
			}))

			props.filter(babyloid.is.meshoid).forEach(mesh => mesh.isVisible = false)
			physics.forEach(mesh => mesh.dispose())
		}

		return metas
	})()

	created() {}
	updated() {}
	deleted() {
		this.parts.dispose()
		this.coordination.dispose()
	}
}

