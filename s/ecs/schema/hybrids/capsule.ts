
import {HuRealm} from "../../../models/realm/realm.js"
import {HybridComponent, Vec3, scalar} from "@benev/toolbox"

export class Capsule extends HybridComponent<HuRealm, {
		height: number
		radius: number
	}> {

	readonly halfHeight = (this.state.height - (2 * this.state.radius)) / 2

	readonly capsule = this.realm.physics.prefabs.characterCapsule({
		contact_force_threshold: 0.02,
		groups: this.realm.physics.grouper.specify({
			filter: [this.realm.physics.groups.all],
			membership: [this.realm.physics.groups.standard, this.realm.physics.groups.capsule],
		}),
		offset: 0.1,
		material: this.realm.colors.cyan,
		mass: 70,
		radius: this.state.radius,
		halfHeight: this.halfHeight,
		snapToGround: {
			distance: this.halfHeight / 2,
		},
		autostep: {
			maxHeight: this.halfHeight,
			minWidth: this.state.radius,
			includeDynamicBodies: false,
		},
		slopes: {
			minSlideAngle: scalar.radians.from.degrees(75),
			maxClimbAngle: scalar.radians.from.degrees(46),
		},
	})

	setDebug(d: boolean) {
		this.capsule.mesh.setEnabled(d)
	}

	get position() {
		return this.capsule.bond.position
	}

	set position(p: Vec3) {
		this.capsule.bond.position = p
	}

	created() {
		const {entityId} = this
		const {rigid} = this.capsule
		this.realm.physics.capsules.set(this.capsule.collider, {entityId, rigid})
	}
	updated() {}
	deleted() {
		this.capsule.dispose()
		this.realm.physics.capsules.delete(this.capsule.collider)
	}
}

