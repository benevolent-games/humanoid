
import {Scene} from "@babylonjs/core/scene.js"
import {Physics, debug_colors} from "@benev/toolbox"

export const preparePhysics = ({hz, scene, colors}: {
		hz: number
		scene: Scene
		colors: ReturnType<typeof debug_colors>
	}) => new Physics({
	hz,
	scene,
	colors,
	gravity: [0, -9.81, 0],
	contact_force_threshold: 0.1,
})

