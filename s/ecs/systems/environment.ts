
import {hub} from "../hub.js"
import {Archetypes} from "../archetypes/archetypes.js"
import {babylonian, obtain_babylon_quaternion_from_mesh, quat, vec3} from "@benev/toolbox"

export const environment_system = hub
	.behavior("environment")
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
			const meshId = realm.stores.meshes.keep(mesh)
			const entityId = realm.entities.create({
				physical: "fixed",
				mesh: meshId,
				scale: babylonian.to.vec3(mesh.scaling),
				position: babylonian.to.vec3(mesh.position),
				rotation: babylonian.to.quat(
					obtain_babylon_quaternion_from_mesh(mesh)
				),
			})
			disposables.add(() => {
				realm.entities.delete(entityId)
				realm.stores.meshes.forget(meshId)
			})
		}

		for (const node of dynamic_nodes)
			node.setEnabled(false)

		const balls = gym.top_level_nodes.filter(m => m.name.includes("hanging_ball"))!
		const bags = gym.top_level_nodes.filter(m => m.name.includes("hanging_heavybag"))!

		for (const ball of balls) {
			const instance = ball.instantiateHierarchy()!
			const position = babylonian.to.vec3(instance.absolutePosition)
			instance.setEnabled(false)

			realm.entities.create({
				joint: {
					anchors: [[0, 0, 0], [0, 1, 0]],
					parts: [
						realm.entities.create({
							physical: "fixture",
							position,
						}),
						realm.entities.create(Archetypes.physicsBox({
							scale: [.75, .75, .75],
							density: 1000,
							rotation: quat.identity(),
							position: vec3.add(position, [0, -1, 0]),
						})),
					],
				}
			})
		}

		for (const bag of bags) {
			const instance = bag.instantiateHierarchy()!
			const position = babylonian.to.vec3(instance.absolutePosition)
			instance.setEnabled(false)

			realm.entities.create({
				joint: {
					anchors: [[0, 0, 0], [0, 1, 0]],
					parts: [
						realm.entities.create({
							physical: "fixture",
							position,
						}),
						realm.entities.create(Archetypes.physicsBox({
							scale: [0.5, 1.5, 0.5],
							density: 1000,
							rotation: quat.identity(),
							position: vec3.add(position, [0, -1, 0]),
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
		execute() {

		},
		dispose() {
			for (const dispose of disposables)
				dispose()
		},
	}
})

