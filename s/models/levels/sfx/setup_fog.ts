
import {Rand, Stage, Vec2, Vec3, scalar} from "@benev/toolbox"

import {Color4} from "@babylonjs/core/Maths/math.color.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {ParticleSystem} from "@babylonjs/core/Particles/index.js"
import {Texture} from "@babylonjs/core/Materials/Textures/texture.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

export default ({
		url,
		stage,
		extent: [extentA, extentB],
		particles: {
			colors: [color1, color2],
			sizes: [sizeMin, sizeMax],
			count, alpha, spinrate, fadeRange,
		},
	}: {
		stage: Stage
		url: string
		extent: [Vec3, Vec3],
		particles: {
			colors: [Vec3, Vec3],
			count: number,
			alpha: number,
			spinrate: number,
			fadeRange: number
			sizes: Vec2
		},
	}) => {

	const {scene} = stage

	const texture = new Texture(url, scene)
	const system = new ParticleSystem("fog", count, scene)
	system.particleTexture = texture

	system.emitter = new Vector3(0, 0, 0)
	system.minEmitBox = new Vector3(...extentA)
	system.maxEmitBox = new Vector3(...extentB)

	system.color1 = new Color4(...color1, 0.8 * alpha)
	system.color2 = new Color4(...color2, 1.0 * alpha)

	system.minSize = sizeMin
	system.maxSize = sizeMax

	system.manualEmitCount = count
	system.minLifeTime = Infinity
	system.blendMode = ParticleSystem.BLENDMODE_STANDARD

	const distanceFadeOut = sizeMax / 3
	const distanceFadeIn = distanceFadeOut + fadeRange

	system.updateFunction = (particles) => {
		const randy = Rand.seed(1)
		const camera = stage.rendering.camera
		const cameraPosition = (camera.parent && camera.parent instanceof TransformNode)
			? camera.parent.absolutePosition
			: camera.position

		for (const particle of particles) {
			const distance = Vector3.Distance(particle.position, cameraPosition)
			const particleAlpha = scalar.map(randy.random(), [0.5, 1.0]) * alpha

			particle.color.a = scalar.clamp(
				scalar.remap(distance, [distanceFadeOut, distanceFadeIn], [0, particleAlpha]),
				0,
				particleAlpha,
			)

			particle.angle += scalar.radians.from.degrees(
				(randy.random() * spinrate) - (spinrate / 2)
			)
		}
	}

	system.start()

	return {
		dispose: () => {
			system.dispose()
			texture.dispose()
		},
	}
}

