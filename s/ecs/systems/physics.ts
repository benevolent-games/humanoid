
import {hub} from "../hub.js"
import {HumanoidSchema} from "../schema.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Ecs3, Phys, Vec3, babylonian, quat, vec3} from "@benev/toolbox"

export const physics_dynamics_system = hub
	.behavior("physics_dynamics")
	.select(
		"physical",
		"shape",
		"position",
		"rotation",
		"scale",
		"density",
	)
	.lifecycle(realm => (init, id) => {

	let mesh: Mesh
	let dispose = () => {}

	switch (init.shape) {
		case "box": {
			const actor = realm.physics.box({
				scale: init.scale,
				density: init.density,
				position: init.position,
				rotation: init.rotation,
			})
			mesh = actor.mesh
			dispose = () => actor.dispose()
			realm.entities.update(id, {
				...init,
				physics_actor_ref: realm.physicsStore.keep(actor),
			})
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

export const physics_fixed_system = hub
	.behavior("physics_fixed")
	.select(
		"physical",
		"mesh",
		"position",
		"rotation",
		"scale",
	)
	.lifecycle(realm => (init, id) => {

	const mesh = realm.meshStore.recall(init.mesh)
	const actor = realm.physics.trimesh(mesh)

	realm.entities.update(id, {
		...init,
		physics_actor_ref: realm.physicsStore.keep(actor),
	})

	return {
		execute() {},
		dispose() {
			actor.dispose()
		},
	}
})

export const physics_joints_system = hub
	.behavior("physics_joints")
	.complex(realm => ({passes, pass}) => {

	type JointRecord = {
		joint: Phys.Joint
		alphaId: Ecs3.Id
		bravoId: Ecs3.Id
	}

	type PendingJoint = {
		joint: HumanoidSchema["joint"]
		attempts: number
	}

	const jointRecords = new Map<Ecs3.Id, JointRecord>()
	const actorRecords = new Map<Ecs3.Id, Phys.Actor>()
	const pendingJoints = new Map<Ecs3.Id, PendingJoint>()

	function make_physics_joint(
			alpha: Phys.Actor,
			bravo: Phys.Actor,
			anchors: [Vec3, Vec3],
		) {
		return realm.physics.joint_spherical({
			bodies: [alpha.rigid, bravo.rigid],
			anchors,
		})
	}

	return passes({
		physicals: pass({
			query: ["physics_actor_ref"],
			events: {
				initialize(id, state) {
					const actor = realm.physicsStore.recall(state.physics_actor_ref)
					actorRecords.set(id, actor)
				},
				dispose(id) {
					actorRecords.delete(id)
					for (const [jointId, jointRecord] of [...jointRecords]) {
						const part_of_joint_is_gone = (
							jointRecord.alphaId === id ||
							jointRecord.bravoId === id
						)
						if (part_of_joint_is_gone)
							realm.entities.delete(jointId)
					}
				},
			},
		}),

		joints: pass({
			query: ["joint"],
			events: {
				initialize(id, {joint}) {
					pendingJoints.set(id, {joint, attempts: 0})
				},
				dispose(id) {
					pendingJoints.delete(id)
					const record = jointRecords.get(id)
					if (record) {
						record.joint.dispose()
						jointRecords.delete(id)
					}
				},
			},
		}),

	}).execute(() => {
		for (const [id, pending] of [...pendingJoints]) {
			pending.attempts += 1

			const {parts: [id1, id2], anchors} = pending.joint
			const alpha = actorRecords.get(id1)
			const bravo = actorRecords.get(id2)

			if (alpha && bravo) {
				jointRecords.set(id, {
					joint: make_physics_joint(alpha, bravo, anchors),
					alphaId: id1,
					bravoId: id2,
				})
				pendingJoints.delete(id)
			}
			else if (pending.attempts > 10) {
				console.warn(`failed to create joint`, pending)
				pendingJoints.delete(id)
			}
		}
	})
})

