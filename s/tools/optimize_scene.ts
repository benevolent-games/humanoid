
import {Scene, ScenePerformancePriority} from "@babylonjs/core/scene.js"

/** these performance optimizations kill a lot of our post-processing effects. */
export function optimize_scene(scene: Scene) {
	// scene.performancePriority = ScenePerformancePriority.Intermediate
	// scene.autoClear = false
	// scene.skipFrustumClipping = true
	// scene.skipPointerMovePicking = true
	// scene.skipPointerDownPicking = true
	// scene.skipPointerUpPicking = true
	// // scene.autoClearDepthAndStencil = false
}

