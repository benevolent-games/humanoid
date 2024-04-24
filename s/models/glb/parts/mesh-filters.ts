
import {nquery} from "@benev/toolbox"
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"

export function isFoliage(mesh: AbstractMesh) {
	return !!(
		nquery(mesh).name("grass") ||
		nquery(mesh).tag("grass")
	)
}

export function isHair(mesh: AbstractMesh) {
	return !!(
		mesh.name.startsWith("hair") ||
		nquery(mesh).name("hair") ||
		nquery(mesh).tag("hair")
	)
}

