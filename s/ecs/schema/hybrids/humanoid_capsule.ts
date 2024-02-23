
import {HumanoidRealm} from "../../../models/realm/realm.js"
import {HybridComponent, Vec3, babylonian, scalar, vec3} from "@benev/toolbox"

export class HumanoidCapsule extends HybridComponent<HumanoidRealm, {
		height: number
		radius: number
	}> {

	readonly capsule = (() => {
		const {state, realm} = this
		const halfHeight = (state.height - (2 * state.radius)) / 2
		return realm.physics.character({
			mass: 70,
			radius: state.radius,
			halfHeight,
			snapToGround: {
				distance: halfHeight / 2,
			},
			autostep: {
				maxHeight: halfHeight,
				minWidth: state.radius,
				includeDynamicBodies: false,
			},
			slopes: {
				minSlideAngle: scalar.radians.from.degrees(75),
				maxClimbAngle: scalar.radians.from.degrees(46),
			},
		})
	})()

	setDebug(d: boolean) {
		this.capsule.mesh.setEnabled(d)
	}

	get position() {
		return babylonian.to.vec3(this.capsule.position)
	}

	set position(p: Vec3) {
		this.capsule.rigid.setTranslation(vec3.to.xyz(p), true)
	}

	created() {}
	updated() {}
	deleted() {
		this.capsule.dispose()
	}
}

