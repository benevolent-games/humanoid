
import {Scene, ScenePerformancePriority} from "@babylonjs/core/scene.js"

export function optimize_scene(scene: Scene) {
	scene.performancePriority = ScenePerformancePriority.BackwardCompatible

	scene.autoClear = false
	scene.skipPointerMovePicking = true
	scene.skipPointerDownPicking = true
	scene.skipPointerUpPicking = true

	// scene.skipFrustumClipping = false
	// scene.autoClearDepthAndStencil = false
}

