
import {Prop, Vec3} from "@benev/toolbox"
import {Material} from "@babylonjs/core/Materials/material.js"

export namespace Tracing {
	export type Line = [Vec3, Vec3]
	export type Triangle = [Vec3, Vec3, Vec3]
	export type EdgeTriangles = [Triangle, Triangle]

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
		ribbonGuides: {kind: RibbonKind, prop: Prop}[]
		makeRibbonBlueprint: () => Blueprint
	}

	export type Blueprint = {
		nearcapPosition: Vec3
		protoRibbons: ProtoRibbon[]
	}

	export type Appearance = {
		isVisible: boolean
		sheets: Record<RibbonKind, Material>
		edges: Record<RibbonKind, Material>
	}
}

