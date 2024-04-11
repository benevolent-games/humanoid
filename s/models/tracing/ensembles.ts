
import {babyloid, nametag, nquery} from "@benev/toolbox"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"

import {Tracing} from "./types.js"
import {Weapon} from "../armory/weapon.js"
import {Weaponry} from "../../ecs/components/hybrids/character/types.js"

const ribbonSortOrder = Object.fromEntries(
	(["damage", "grace", "handle"] satisfies Tracing.RibbonKind[])
		.map((kind, index) => [kind, index])
) as Record<Tracing.RibbonKind, number>

export function make_tracer_ensembles(weaponry: Weaponry) {
	const ensembles = new Map<Weapon.Name, Tracing.Ensemble>()
	const weapons = [...weaponry.right].filter(([name]) => name !== "reference")

	for (const [name, mesh] of [...weapons]) {
		const props = mesh.getChildren(babyloid.is.prop)
		const physics = props.filter(p => nquery(p).name("physics"))

		const nearcaps = props.filter(p => nquery(p).name("near"))
		const [nearcap] = nearcaps

		const ribbonGuides = props
			.filter(p => nquery(p).tag("ribbon")).map(prop => {
				const kind = nametag(prop.name).name as Tracing.RibbonKind
				return {kind, prop}
			})
			.sort((a, b) => ribbonSortOrder[a.kind] - ribbonSortOrder[b.kind])

		ensembles.set(name as Weapon.Name, {
			nearcap,
			ribbonGuides,
			makeRibbonBlueprint: (): Tracing.Blueprint => ({
				nearcapPosition: babyloid.to.vec3(nearcap.getAbsolutePosition()),
				protoRibbons: ribbonGuides.map(({kind, prop}) => {
					const matrix = prop.computeWorldMatrix(true)
					const a = new Vector3(0, 0, 0)
					const b = new Vector3(0, 1, 0)
					return {
						kind,
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
}

