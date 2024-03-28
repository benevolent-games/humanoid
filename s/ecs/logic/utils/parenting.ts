
import {Ecs} from "@benev/toolbox"
import {Entity, World, arch} from "../../hub.js"
import {Children, Parent} from "../../schema/schema.js"

export class Parenting {
	constructor(public world: World) {}

	unparent(parent: Entity, child: Entity) {
		child.unassign({Parent})
		if (parent.has({Children}))
			parent.components.children = parent.components.children.filter(id => id !== child.id)
	}

	parent(parent: Ecs.Entity, child: Ecs.Entity) {
		const child_already_has_a_different_parent = (
			child.has({Parent}) && child.components.parent !== parent.id
		)

		if (child_already_has_a_different_parent)
			this.unparent(this.world.getEntity(child.components.parent), child)

		child.assign(arch({Parent}, {parent: parent.id}))

		if (parent.has({Children})) {
			if (!parent.components.children.some(id => id === child.id))
				parent.components.children.push(child.id)
		}
		else
			parent.assign(arch({Children}, {children: [child.id]}))
	}
}

