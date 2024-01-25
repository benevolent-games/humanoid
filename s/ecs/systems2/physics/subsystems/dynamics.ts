
import {behavior} from "../../../hub.js"
import {babylonian} from "@benev/toolbox"
import {HumanoidSchema} from "../../../schema.js"

export const dynamics = behavior("dynamics")

	.select(
		"debug",
		"physical_dynamic",
		"shape",
		"position",
		"rotation",
		"scale",
		"density",
		"damping_linear",
		"damping_angular",
	)

	.lifecycle(realm => (init, id) => {

		const subject = (() => {switch (init.shape) {
			case "box": return realm.physics.box({
				scale: init.scale,
				density: init.density,
				position: init.position,
				rotation: init.rotation,
				linearDamping: init.damping_linear,
				angularDamping: init.damping_angular,
				material: init.debug
					? realm.physics.colors.cyan
					: undefined,
			})
			default:
				throw new Error(`unknown shape "${init.shape}"`)
		}})()

		const refs = {
			prop_ref: realm.stores.props.keep(subject.mesh),
			physics_rigid_ref: realm.stores.physics_rigids.keep(subject.rigid),
		} satisfies Partial<HumanoidSchema>

		realm.entities.update(id, {...init, ...refs})

		return {
			tick(_tick, state) {
				const {mesh} = subject
				state.position = babylonian.to.vec3(mesh.position)
				state.rotation = babylonian.to.quat(mesh.absoluteRotationQuaternion)
			},
			end() {
				subject.dispose()
				realm.stores.props.forget(refs.prop_ref)
				realm.stores.physics_rigids.forget(refs.physics_rigid_ref)
			},
		}
	})

