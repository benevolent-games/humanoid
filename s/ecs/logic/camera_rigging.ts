
import {babyloid} from "@benev/toolbox"
import {Camera} from "../components/hybrids/camera.js"
import {molasses3d} from "../../tools/molasses.js"
import {behavior, responder, system} from "../hub.js"
import {CameraRig} from "../components/hybrids/camera_rig.js"
import {Controllable, Debug, Gimbal, Orbit, Perspective, Position, Rotation, Smoothing} from "../components/plain_components.js"

export const camera_rigging = system("camera rigging", ({realm}) => [

	responder("camera rig debug")
		.select({CameraRig, Debug})
		.respond(({components: {cameraRig, debug}}) => {
			cameraRig.setDebug(debug)
		}),

	responder("parent camera to rig headbox")
		.select({CameraRig, Camera})
		.respond(({components: c}) => {
			c.camera.node.parent = c.cameraRig.parts.headbox
			c.camera.node.position.z = -(c.cameraRig.state.third_person_distance)
			return () => {
				if (c.camera.node.parent === c.cameraRig.parts.headbox)
					c.camera.node.parent = null
			}
		}),

	responder("establish rig position")
		.select({CameraRig, Position})
		.respond(({components: c}) => {
			c.cameraRig.position = c.position
		}),

	responder("activate/deactivate the camera")
		.select({CameraRig, Camera})
		.respond(({components}) => {
			realm.stage.rendering.setCamera(components.camera.node)
			return () => {
				realm.stage.rendering.setCamera(null)
			}
		}),

	responder("switch perspective")
		.select({Controllable, Perspective})
		.respond(({components}) => {
			return realm.tact.inputs.humanoid.buttons.perspective.on(input => {
				if (input.down && !input.repeat) {
					components.perspective = components.perspective === "first_person"
						? "third_person"
						: "first_person"
				}
			})
		}),

	behavior("update third person distance")
		.select({CameraRig, Camera, Perspective})
		.logic(() => ({components: {cameraRig, camera, perspective}}) => {
			camera.node.position.z = (perspective === "first_person")
				? 0
				: -(cameraRig.state.third_person_distance)
		}),

	behavior("sync camera rig position")
		.select({CameraRig, Perspective, Position, Smoothing})
		.logic(() => ({components: {cameraRig, perspective, position, smoothing}}) => {
			cameraRig.position = (perspective === "first_person")
				? position
				: molasses3d(smoothing, cameraRig.position, position)
		}),

	behavior("apply gimbal to rig")
		.select({CameraRig, Gimbal, Orbit})
		.logic(() => ({components: {cameraRig, gimbal, orbit}}) => {
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
		.logic(() => ({components: c}) => {
			c.rotation = babyloid.ascertain.quat(
				c.cameraRig.parts.transform
			)
		}),
])

