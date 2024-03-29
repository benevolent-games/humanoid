
import {behavior} from "../../hub.js"
import {Archetypes} from "../../archetypes/archetypes.js"
import {babylonian, obtain_babylon_quaternion_from_mesh, quat, vec3} from "@benev/toolbox"

export const environment = behavior("environment")
	.select("environment")
	.lifecycle(realm => ({environment}) => {

	const disposables = new Set<() => void>()

	if (environment === "gym") {
		const gym = realm.spawn.gym()
		console.log("gym", gym)
		disposables.add(gym.dispose)

		const static_meshes = gym
			.all_meshes
			.filter(mesh => !(
				mesh.name.includes("feature") ||
				mesh.name.includes("toy")
			))

		const dynamic_nodes = gym
			.top_level_nodes
			.filter(node => (
				node.name.includes("feature") ||
				node.name.includes("toy")
			))

		for (const mesh of static_meshes) {
			const prop_ref = realm.stores.props.keep(mesh)
			const entityId = realm.entities.create({
				physical_static: {},
				prop_ref,
				scale: babylonian.to.vec3(mesh.scaling),
				position: babylonian.to.vec3(mesh.position),
				rotation: babylonian.to.quat(
					obtain_babylon_quaternion_from_mesh(mesh)
				),
			})
			disposables.add(() => {
				realm.entities.delete(entityId)
				realm.stores.meshes.forget(prop_ref)
			})
		}

		for (const node of dynamic_nodes)
			node.setEnabled(false)

		const balls = gym.top_level_nodes.filter(m => m.name.includes("hanging_ball"))!
		const bags = gym.top_level_nodes.filter(m => m.name.includes("hanging_heavybag"))!

		for (const ball of balls) {
			const instance = ball.instantiateHierarchy()!
			const position = babylonian.to.vec3(instance.absolutePosition)
			const prop_ref = realm.stores.props.keep(instance)

			disposables.add(() => {
				instance.dispose()
				realm.stores.props.forget(prop_ref)
			})

			realm.entities.create({
				joint: {
					anchors: [[0, 0, 0], [0, 1, 0]],
					parts: [
						realm.entities.create({
							physical_fixture: {},
							position,
						}),
						realm.entities.create(Archetypes.physicsBox({
							debug: false,
							scale: [.75, .75, .75],
							density: 1000,
							rotation: quat.identity(),
							position: vec3.add(position, [0, -1, 0]),
							damping_linear: .3,
							damping_angular: .3,
							child_prop_refs: [prop_ref],
						})),
					],
				}
			})
		}

		for (const bag of bags) {
			const instance = bag.instantiateHierarchy()!
			const position = babylonian.to.vec3(instance.absolutePosition)
			const prop_ref = realm.stores.props.keep(instance)

			disposables.add(() => {
				instance.dispose()
				realm.stores.props.forget(prop_ref)
			})

			realm.entities.create({
				joint: {
					anchors: [[0, 0, 0], [0, 1, 0]],
					parts: [
						realm.entities.create({
							physical_fixture: {},
							position,
						}),
						realm.entities.create(Archetypes.physicsBox({
							debug: false,
							scale: [0.5, 1.5, 0.5],
							density: 1000,
							rotation: quat.identity(),
							position: vec3.add(position, [0, -1, 0]),
							damping_linear: .3,
							damping_angular: .3,
							child_prop_refs: [prop_ref],
						})),
					],
				}
			})
		}
	}
	else {
		console.warn(`unknown environment "${environment}"`)
	}

	return {
		tick() {},
		end() {
			for (const dispose of disposables)
				dispose()
		},
	}
})

