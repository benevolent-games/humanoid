
import {behavior, system} from "../../hub.js"
import {HumanoidSchema} from "../../schema.js"
import {Ecs4, Phys, Rapier, Vec3} from "@benev/toolbox"

type JointRecord = {
	joint: Phys.Joint
	alphaId: Ecs4.Id
	bravoId: Ecs4.Id
}

type PendingJoint = {
	joint: HumanoidSchema["joint"]
	attempts: number
}

export const joints = system("joints", realm => {
	const jointRecords = new Map<Ecs4.Id, JointRecord>()
	const rigidRecords = new Map<Ecs4.Id, Rapier.RigidBody>()
	const pendingJoints = new Map<Ecs4.Id, PendingJoint>()

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

	return [
		behavior("rigid bodies")
			.select("physics_rigid_ref")
			.lifecycle(() => (init, id) => {
				const rigid = realm.stores.physics_rigids.recall(init.physics_rigid_ref)
				rigidRecords.set(id, rigid)
				return {
					tick(_tick) {},
					end() {
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
				}
			}),

		behavior("create joints")
			.select("joint")
			.lifecycle(() => ({joint}, id) => {
				pendingJoints.set(id, {joint, attempts: 0})
				return {
					tick() {},
					end() {
						pendingJoints.delete(id)
						const record = jointRecords.get(id)
						if (record) {
							record.joint.dispose()
							jointRecords.delete(id)
						}
					},
				}
			}),

		behavior("execute joint logic")
			.always(() => () => {
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
			}),
	]
})

