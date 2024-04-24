
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"

export type ShadowListener = {
	addCaster: (mesh: AbstractMesh) => void
	removeCaster: (mesh: AbstractMesh) => void
}

export class ShadowManager {
	#casters = new Set<AbstractMesh>()
	#listeners = new Set<ShadowListener>()

	attachListener(listener: ShadowListener) {
		this.#listeners.add(listener)
		for (const caster of this.#casters)
			listener.addCaster(caster)
		return () => this.unattachListener(listener)
	}

	unattachListener(listener: ShadowListener) {
		this.#listeners.delete(listener)
	}

	registerCasters(mesh: AbstractMesh) {
		this.#casters.add(mesh)
		for (const listener of this.#listeners)
			listener.addCaster(mesh)
		return () => this.unregisterCasters(mesh)
	}

	unregisterCasters(mesh: AbstractMesh) {
		this.#casters.delete(mesh)
		for (const listener of this.#listeners)
			listener.removeCaster(mesh)
	}
}

