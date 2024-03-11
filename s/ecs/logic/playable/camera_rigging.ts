
import {babylonian} from "@benev/toolbox"
import {Camera} from "../../schema/hybrids/camera.js"
import {molasses3d} from "../../../tools/molasses.js"
import {behavior, responder, system} from "../../hub.js"
import {CameraRig} from "../../schema/hybrids/camera_rig.js"
import {Debug, Gimbal, Orbit, Perspective, Position, Rotation, Smoothing} from "../../schema/schema.js"

export const camera_rigging = system("camera rigging", [
	responder("camera rig debug")
		.select({CameraRig, Debug})
		.respond(() => ({
			added(c) { c.cameraRig.setDebug(c.debug) },
			removed() {},
		})),

	responder("parent camera to rig headbox")
		.select({CameraRig, Camera})
		.respond(() => ({
			added(c) {
				c.camera.node.parent = c.cameraRig.parts.headbox
				c.camera.node.position.z = -(c.cameraRig.state.third_person_distance)
			},
			removed(c) {
				if (c.camera.node.parent === c.cameraRig.parts.headbox)
					c.camera.node.parent = null
			},
		})),

	responder("establish rig position")
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
					unbind = realm.tact.inputs.humanoid.buttons.perspective.on(input => {
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

	behavior("update third person distance")
		.select({CameraRig, Camera, Perspective})
		.act(() => ({cameraRig, camera, perspective}) => {
			camera.node.position.z = (perspective === "first_person")
				? 0
				: -(cameraRig.state.third_person_distance)
		}),

	behavior("sync camera rig position")
		.select({CameraRig, Perspective, Position, Smoothing})
		.act(() => ({cameraRig, perspective, position, smoothing}) => {
			cameraRig.position = (perspective === "first_person")
				? position
				: molasses3d(smoothing, cameraRig.position, position)
		}),

	behavior("apply gimbal to rig")
		.select({CameraRig, Gimbal, Orbit})
		.act(() => ({cameraRig, gimbal, orbit}) => {
			if (orbit) {
				const [x, y] = gimbal
				const [ox] = orbit
				const diff = x - ox
				cameraRig.applyGimbal([x + diff, y])
			}
			else
				cameraRig.applyGimbal(gimbal)
		}),

	behavior("update rotation")
		.select({CameraRig, Rotation})
		.act(() => c => {
			c.rotation = babylonian.ascertain.quat(
				c.cameraRig.parts.transform
			)
		}),
])

