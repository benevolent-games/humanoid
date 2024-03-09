
import {Scene} from "@babylonjs/core/scene.js"
import {Physics, debug_colors} from "@benev/toolbox"

export const preparePhysics = ({scene, hertz, colors}: {
		scene: Scene
		hertz: number
		colors: ReturnType<typeof debug_colors>
	}) => new Physics({
	hertz,
	scene,
	colors,
	gravity: [0, -9.81, 0],
})

