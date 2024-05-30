
import {nametag} from "@benev/toolbox"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"

class LodMaster {
	static parse(mesh: Mesh) {
		const tag = nametag(mesh.name)
		const name = tag.name
		const lod = Number(tag.get("lod"))
		if (isNaN(lod)) throw new Error(`invalid lod for "${mesh.name}"`)
		return {name, lod}
	}

	readonly name: string
	#sequence: (Mesh | undefined)[] = Array(4)

	constructor(public mesh: Mesh) {
		const {name} = LodMaster.parse(mesh)
		this.name = name
		this.add(mesh)
	}

	add(mesh: Mesh) {
		const {lod} = LodMaster.parse(mesh)
		this.#sequence[lod] = mesh
	}

	#getFanciest() {
		for (const mesh of this.#sequence) {
			if (mesh)
				return mesh
		}
		throw new Error(`no lod mesh in sequence for "${this.name}"`)
	}

	get sequence() {
		let previous = this.#getFanciest()
		return this.#sequence.map(mesh => {
			if (mesh) {
				previous = mesh
				return mesh
			}
			else return previous
		})
	}
}

export function setup_lods(meshes: AbstractMesh[]) {
	const lodmeshes = meshes.filter(m => nametag(m.name).get("lod"))
	const sources = lodmeshes.filter(m => m instanceof Mesh) as Mesh[]
	const instances = lodmeshes.filter(m => m instanceof InstancedMesh) as InstancedMesh[]
	const map = new Map<string, LodMaster>()

	for (const mesh of sources) {
		const {name} = LodMaster.parse(mesh)
		const lodmaster = map.get(name)
		if (lodmaster)
			lodmaster.add(mesh)
		else
			map.set(name, new LodMaster(mesh))
	}

	for (const lodmaster of map.values()) {
		const [fancyMesh, midMesh, potatoMesh, bingusMesh] = lodmaster.sequence
		fancyMesh.addLODLevel(10, midMesh)
		fancyMesh.addLODLevel(20, potatoMesh)
		fancyMesh.addLODLevel(40, bingusMesh)
	}
}

/*
fence::lod=0
	(instance) fence::lod=0.001
	(instance) fence::lod=0.002
	(instance) fence::lod=0.003
	(instance) fence::lod=0.004
	(instance) fence::lod=0.005
	(instance) fence::lod=0.006
fence::lod=1
	(instance) fence::lod=1.001
fence::lod=2
	(instance) fence::lod=2.001
	(instance) fence::lod=2.001
fence::lod=3

new Map([
	["fence", [Mesh, Mesh, Mesh, Mesh]]
])

*/
