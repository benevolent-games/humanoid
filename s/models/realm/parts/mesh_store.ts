
import {id_counter} from "@benev/toolbox"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"

export class MeshStore {
	#map = new Map<number, Mesh | InstancedMesh>
	#id = id_counter()

	keep(mesh: Mesh | InstancedMesh) {
		const id = this.#id()
		this.#map.set(id, mesh)
		return id
	}

	recall(id: number) {
		const mesh = this.#map.get(id)
		if (!mesh)
			throw new Error(`MeshStore failed to recall mesh ${id}`)
		return mesh
	}

	forget(id: number) {
		this.#map.delete(id)
	}
}

