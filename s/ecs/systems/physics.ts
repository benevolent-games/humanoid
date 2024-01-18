
import {mainthread} from "../hub.js"
import {babylonian, quat, vec3} from "@benev/toolbox"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"

export const physics_dynamic_system = mainthread.lifecycle
	("physics_dynamic")(
		"physical",
		"shape",
		"position",
		"rotation",
		"scale",
		"density",
	)(realm => init => {

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

export const physics_joints_system = mainthread.lifecycle
	("physics_joints")(
		"physics_joints",
		"position",
	)(realm => init => {

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
		execute(_tick, state) {
			// state.position = babylonian.to.vec3(mesh.position)
			// state.rotation = babylonian.to.quat(mesh.absoluteRotationQuaternion)
		},
	}
})

export const physics_fixed_system = mainthread.lifecycle("physics_fixed")(
		"physical",
		"mesh",
		"position",
		"rotation",
		"scale",
	)(realm => init => {

	const mesh = realm.meshStore.recall(init.mesh)
	const body = realm.physics.trimesh(mesh)

	return {
		execute() {},
		dispose() {
			body.dispose()
		},
	}
})

