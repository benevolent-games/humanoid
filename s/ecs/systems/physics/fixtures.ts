
import {behavior} from "../../hub.js"

export const fixtures = behavior("fixtures")
	.select("physical_fixture", "position")
	.lifecycle(realm => (init, id) => {
			const fixture = realm.physics.fixture({position: init.position})
			const physics_rigid_ref = realm.stores.physics_rigids.keep(fixture.rigid)
			realm.entities.update(id, {...init, physics_rigid_ref})
			return {
				tick() {},
				end: fixture.dispose,
			}
	})

