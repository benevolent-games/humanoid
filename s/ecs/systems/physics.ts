
import {hub} from "../hub.js"
import {HumanoidSchema} from "../schema.js"
import {Ecs3, Phys, Rapier, Vec3, babylonian, prop_is_meshoid} from "@benev/toolbox"

export const physics_dynamics_system = hub
	.behavior("physics_dynamics")
	.select(
		"debug",
		"physical_dynamic",
		"shape",
		"position",
		"rotation",
		"scale",
		"density",
		"damping_linear",
		"damping_angular",
	)
	.lifecycle(realm => (init, id) => {

	const subject = (() => {switch (init.shape) {
		case "box": return realm.physics.box({
			scale: init.scale,
			density: init.density,
			position: init.position,
			rotation: init.rotation,
			linearDamping: init.damping_linear,
			angularDamping: init.damping_angular,
			material: init.debug
				? realm.physics.colors.cyan
				: undefined,
		})
		default:
			throw new Error(`unknown shape "${init.shape}"`)
	}})()

	const refs = {
		prop_ref: realm.stores.props.keep(subject.mesh),
		physics_rigid_ref: realm.stores.physics_rigids.keep(subject.rigid),
	} satisfies Partial<HumanoidSchema>

	realm.entities.update(id, {...init, ...refs})

	return {
		dispose() {
			subject.dispose()
			realm.stores.props.forget(refs.prop_ref)
			realm.stores.physics_rigids.forget(refs.physics_rigid_ref)
		},
		execute(_tick, state) {
			const {mesh} = subject
			state.position = babylonian.to.vec3(mesh.position)
			state.rotation = babylonian.to.quat(mesh.absoluteRotationQuaternion)
		},
	}
})

export const physics_fixed_system = hub
	.behavior("static physics")
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
		return Ecs3.no_life
	}

	const actor = realm.physics.trimesh(prop)
	const physics_rigid_ref = realm.stores.physics_rigids.keep(actor.rigid)
	realm.entities.update(id, {...init, physics_rigid_ref})

	return {
		execute() {},
		dispose() {
			actor.dispose()
			realm.stores.physics_rigids.forget(physics_rigid_ref)
		},
	}
})

export const physics_fixture = hub
	.behavior("physics_fixture")
	.select("physical_fixture", "position")
	.lifecycle(realm => (init, id) => {

	const fixture = realm.physics.fixture({position: init.position})
	const physics_rigid_ref = realm.stores.physics_rigids.keep(fixture.rigid)
	realm.entities.update(id, {...init, physics_rigid_ref})

	return {
		execute() {},
		dispose: fixture.dispose,
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
	const rigidRecords = new Map<Ecs3.Id, Rapier.RigidBody>()
	const pendingJoints = new Map<Ecs3.Id, PendingJoint>()

	function make_physics_joint(
			alpha: Rapier.RigidBody,
			bravo: Rapier.RigidBody,
			anchors: [Vec3, Vec3],
		) {
		return realm.physics.joint_spherical({
			bodies: [alpha, bravo],
			anchors,
		})
	}

	return passes({
		physicals: pass({
			query: ["physics_rigid_ref"],
			events: {
				initialize(id, state) {
					const rigid = realm.stores.physics_rigids.recall(state.physics_rigid_ref)
					rigidRecords.set(id, rigid)
				},
				dispose(id) {
					rigidRecords.delete(id)
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
			const alpha = rigidRecords.get(id1)
			const bravo = rigidRecords.get(id2)

			if (alpha && bravo) {
				jointRecords.set(id, {
					joint: make_physics_joint(alpha, bravo, anchors),
					alphaId: id1,
					bravoId: id2,
				})
				pendingJoints.delete(id)
			}
			else if (pending.attempts > 10) {
				console.warn(`failed to create joint`, pending, {alpha, bravo})
				pendingJoints.delete(id)
			}
		}
	})
})

