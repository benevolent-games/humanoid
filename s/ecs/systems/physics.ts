
import {hub} from "../hub.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {babylonian, quat, vec3} from "@benev/toolbox"

export const physics_dynamics_system = hub
	.behavior("physics dynamics")
	.select(
		"physical",
		"shape",
		"position",
		"rotation",
		"scale",
		"density",
	)
	.lifecycle(realm => init => {

		let mesh: Mesh
		let dispose = () => {}

		switch (init.shape) {
			case "box": {
				const box = realm.physics.box({
					scale: init.scale,
					density: init.density,
					position: init.position,
					rotation: init.rotation,
				})
				mesh = box.mesh
				dispose = () => box.dispose()
			} break
			default: {
				throw new Error(`unknown shape "${init.shape}"`)
			}
		}

		return {
			dispose,
			execute(_tick, state) {
				state.position = babylonian.to.vec3(mesh.position)
				state.rotation = babylonian.to.quat(mesh.absoluteRotationQuaternion)
			},
		}
	})

export const physical_joints = hub.system<{joints: ("joint")[]}>(base => ({
	name: "physical joints",
	queries: {
		joints: ["joint"],
		physicals: ["physical"],
	},
	events: {
		onEntityCreated([id, state]) {},
		onEntityUpdated([id, state]) {},
		onEntityDeleted(id) {},
	},
	execute(_tick, selections) {
		for (const [_id, state] of selections.joints) {
			state.joint
			state.mass
		}
	},
}))

export const physics_joints_system = hub
	.behavior("physics joints")
	.select(
		"physics_joints",
		"position",
	)
	.lifecycle(realm => init => {
		const boxA = realm.physics.box({
			scale: [1, 1, 1],
			density: 5,
			position: vec3.add(init.position, [-2, 0, 0]),
			rotation: quat.identity(),
		})

		const boxB = realm.physics.box({
			scale: [1, 1, 1],
			density: 5,
			position: vec3.add(init.position, [2, 0, 0]),
			rotation: quat.identity(),
		})

		const joint = realm.physics.joint_spherical({
			bodies: [boxA.rigid, boxB.rigid],
			anchors: [[-2, 0, 0], [2, 0, 0]],
		})

		return {
			dispose() {
				joint.dispose()
				boxA.dispose()
				boxB.dispose()
			},
			execute(_tick, _state) {
				// state.position = babylonian.to.vec3(mesh.position)
				// state.rotation = babylonian.to.quat(mesh.absoluteRotationQuaternion)
			},
		}
	})

export const physics_fixed_system = hub
	.behavior("physics_fixed")
	.select(
		"physical",
		"mesh",
		"position",
		"rotation",
		"scale",
	)
	.lifecycle(realm => init => {

	const mesh = realm.meshStore.recall(init.mesh)
	const body = realm.physics.trimesh(mesh)

	return {
		execute() {},
		dispose() {
			body.dispose()
		},
	}
})

