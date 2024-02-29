

import {Camera} from "../../schema/hybrids/camera.js"
import {behavior, responder, system} from "../../hub.js"
import {CameraRig} from "../../schema/hybrids/camera_rig.js"
import {Gimbal, Perspective, Position} from "../../schema/schema.js"

export const camera_rigging = system("camera rigging", [
	responder("establish camera parented to rig")
		.select({CameraRig, Camera})
		.respond(() => ({
			added(c) {
				c.camera.node.position.z = -(c.cameraRig.state.third_person_distance)
				c.camera.node.parent = c.cameraRig.parts.headbox
			},
			removed(c) {
				if (c.camera.node.parent === c.cameraRig.parts.headbox)
					c.camera.node.parent = null
			},
		})),

	responder("establish capsule position")
		.select({CameraRig, Position})
		.respond(() => ({
			added(c) { c.cameraRig.position = c.position },
			removed() {},
		})),

	responder("activate/deactivate the camera")
		.select({CameraRig, Camera})
		.respond(({realm}) => ({
			added(c) {
				realm.stage.rendering.setCamera(c.camera.node)
			},
			removed() {
				realm.stage.rendering.setCamera(null)
			},
		})),

	responder("switch perspective")
		.select({Perspective})
		.respond(({realm}) => {
			let unbind = () => {}
			return {
				added(c) {
					unbind = realm.impulse.on.humanoid.buttons.perspective(input => {
						if (input.down && !input.repeat) {
							c.perspective = c.perspective === "first_person"
								? "third_person"
								: "first_person"
						}
					})
				},
				removed() {
					unbind()
				},
			}
		}),

	behavior("apply gimbal to rig")
		.select({CameraRig, Gimbal})
		.act(() => c => {
			// const moddedGimbal = apply_spline_to_gimbal_y(c.gimbal, [.1, .5, .7])
			c.cameraRig.applyGimbal(c.gimbal)
		}),

	behavior("update third person distance")
		.select({CameraRig, Camera, Perspective})
		.act(() => ({cameraRig, camera, perspective}) => {
			camera.node.position.z = (perspective === "first_person")
				? 0
				: -(cameraRig.state.third_person_distance)
		}),
])

