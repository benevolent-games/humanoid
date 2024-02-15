
// import {behavior, responder, system} from "../../hub.js"
// import {Children} from "../../schema/schema.js"
// import {Camera} from "../../schema/hybrids/camera.js"
// import {Transform} from "../../schema/hybrids/transform.js"

// export const parenting = system("parenting", [
// 	responder("apply babylon parenting")
// 		.select({Transform, Children})
// 		.respond(({world}) => ({
// 			added(c) {
// 				const child_entities = c.children.map(id => world.getEntity(id, {Camera}))
// 				for (const child of child_entities)
// 					child.camera.node.parent = c.transform.node
// 			},
// 			removed(c) {
// 				for (const id of c.children)
// 					world.deleteEntity(id)
// 			},
// 		})),
// ])

