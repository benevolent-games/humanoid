
import {behavior} from "../../../hub.js"
import {Ecs4, prop_is_meshoid} from "@benev/toolbox"

export const statics = behavior("statics")

	.select(
		"physical_static",
		"prop_ref",
		"position",
		"rotation",
		"scale",
	)

	.lifecycle(realm => (init, id) => {
		const prop = realm.stores.props.recall(init.prop_ref)

		if (!prop_is_meshoid(prop)) {
			realm.entities.delete(id)
			return Ecs4.no_life
		}

		const actor = realm.physics.trimesh(prop)
		const physics_rigid_ref = realm.stores.physics_rigids.keep(actor.rigid)
		realm.entities.update(id, {...init, physics_rigid_ref})

		return {
			tick() {},
			end() {
				actor.dispose()
				realm.stores.physics_rigids.forget(physics_rigid_ref)
			},
		}
	})

