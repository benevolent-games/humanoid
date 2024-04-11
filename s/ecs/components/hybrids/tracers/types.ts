
import {Prop, Vec3} from "@benev/toolbox"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"

export namespace Tracing {
	export type Line = [Vec3, Vec3]
	export type Triangle = [Vec3, Vec3, Vec3]
	export type EdgeTriangles = [Triangle, Triangle]

	export type Ribbon = {
		sheetMesh: Mesh
		edgeMesh: Mesh
		dispose: () => void
	}

	export type RibbonEdge = {
		vector: Vec3
		triangles: EdgeTriangles
	}

	export type RibbonKind = "handle" | "damage" | "grace"

	export type ProtoRibbon = {
		kind: RibbonKind
		line: Tracing.Line
	}

	export type Ensemble = {
		nearcap: Prop
		ribbonGuides: Prop[]
		makeRibbonBlueprint: () => Blueprint
	}

	export type Blueprint = {
		nearcapPosition: Vec3
		protoRibbons: ProtoRibbon[]
	}
}

