
import {Scene, ScenePerformancePriority} from "@babylonjs/core/scene.js"

export function optimize_scene(scene: Scene) {
	scene.performancePriority = ScenePerformancePriority.Intermediate
	scene.autoClear = false
	scene.autoClearDepthAndStencil = false
	scene.skipFrustumClipping = true
	scene.skipPointerMovePicking = true
	scene.skipPointerDownPicking = true
	scene.skipPointerUpPicking = true
}

