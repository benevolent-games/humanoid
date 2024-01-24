
import {hub} from "../hub.js"

export const parenting_system = hub
	.behavior("parenting")
	.select("prop_ref", "child_prop_refs")
	.lifecycle(realm => init => {

	const parent = realm.stores.props.recall(init.prop_ref)

	for (const ref of init.child_prop_refs) {
		const child = realm.stores.props.recall(ref)
		child.setParent(parent)
	}

	return {
		execute(_tick, _state) {},
		dispose() {},
	}
})

