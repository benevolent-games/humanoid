
import {Vec3} from "@benev/toolbox"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"

export namespace Tracing {
	export type Line = [Vec3, Vec3]
	export type Triangle = [Vec3, Vec3, Vec3]
	export type EdgeTriangles = [Triangle, Triangle]

	export type Ribbon = {
		sheetMesh: Mesh
		edgeMesh: Mesh
		edgeVector: Vec3
		edgeTriangles: EdgeTriangles
	}

	export type Graphics = {
		ribbons: {
			far: Ribbon
			near: Ribbon
		}
		dispose: () => void
	}
}

