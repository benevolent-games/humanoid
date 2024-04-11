
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {Prop, babyloid, nametag, nquery} from "@benev/toolbox"

import {Tracing} from "../tracers/types.js"
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

	readonly weaponEnsembles = (() => {
		const ensembles = new Map<Weapon.Name, Tracing.Ensemble>()
		const weapons = [...this.weapons.right].filter(([name]) => name !== "reference")

		for (const [name, mesh] of [...weapons]) {
			const props = mesh.getChildren(babyloid.is.prop)
			const physics = props.filter(p => nquery(p).name("physics"))
			const ribbonGuides = props.filter(p => nquery(p).tag("ribbon"))
			const nearcaps = props.filter(p => nquery(p).name("near"))
			const [nearcap] = nearcaps

			ensembles.set(name as Weapon.Name, {
				nearcap,
				ribbonGuides,
				makeRibbonBlueprint: (): Tracing.Blueprint => ({
					nearcapPosition: babyloid.to.vec3(nearcap.getAbsolutePosition()),
					protoRibbons: ribbonGuides.map(prop => {
						const matrix = prop.computeWorldMatrix(true)
						const a = new Vector3(0, 0, 0)
						const b = new Vector3(0, 1, 0)
						return {
							kind: nametag(prop.name).name as Tracing.RibbonKind,
							line: [
								babyloid.to.vec3(Vector3.TransformCoordinates(a, matrix)),
								babyloid.to.vec3(Vector3.TransformCoordinates(b, matrix)),
							],
						}
					}),
				}),
			})

			props.filter(babyloid.is.meshoid).forEach(mesh => mesh.isVisible = false)
			physics.forEach(mesh => mesh.dispose())
		}

		return ensembles
	})()

	// todo = (() => {
	// 	const ensemble = this.weaponEnsembles.get("hatchet")!
	// 	const visuals = ensemble.ribbonGuides.map(prop => {
	// 		if (babyloid.is.meshoid(prop)) {
	// 			prop.material = this.realm.colors.green
	// 			prop.isVisible = true
	// 			prop.visibility = 0.2
	// 			console.log(prop.name, prop.scaling, prop)
	// 		}
	// 		const alpha = MeshBuilder.CreateIcoSphere("box", {radius: 0.04})
	// 		const bravo = MeshBuilder.CreateIcoSphere("box", {radius: 0.04})
	// 		alpha.material = this.realm.colors.blue
	// 		bravo.material = this.realm.colors.red
	// 		const update = ([a, b]: Tracing.Line) => {
	// 			alpha.position.set(...a)
	// 			bravo.position.set(...b)
	// 		}
	// 		return update
	// 	})
	// 	return () => {
	// 		const blueprint = ensemble.makeRibbonBlueprint()
	// 		blueprint.protoRibbons.forEach((proto, index) => {
	// 			const update = visuals[index]
	// 			update(proto.line)
	// 		})
	// 	}
	// })()

	created() {}
	updated() {}
	deleted() {
		this.parts.dispose()
		this.coordination.dispose()
	}
}

