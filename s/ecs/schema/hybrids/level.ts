
import {explode_promise} from "@benev/slate"
import {Node} from "@babylonjs/core/node.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Light} from "@babylonjs/core/Lights/light.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {HybridComponent, Meshoid, Prop, Vec3, babylonian, quat, vec3} from "@benev/toolbox"

import {HumanoidAssets} from "../../../asset_links.js"
import {HumanoidRealm} from "../../../models/realm/realm.js"

export type LevelName = keyof HumanoidAssets["glbs"]["levels"]

export class Level extends HybridComponent<HumanoidRealm, {name: LevelName}> {
	#dispose: (() => void) | null = null
	#promise = explode_promise<void>()

	get doneLoading() {
		return this.#promise.promise
	}

	#make_level_disposer = (stuff: LevelStuff) => {
		this.#dispose = () => {
			stuff.accoutrement.dispose()
			stuff.level.dispose()
		}
	}

	#spawn_level(promise: Promise<AssetContainer>, physics: boolean) {
		return promise
			.then(instance_level)
			.then(setup_level_accoutrements(this.realm, physics))
			.then(this.#make_level_disposer)
			.then(() => this.#promise.resolve())
	}

	created() {
		const {state: {name}} = this
		this.#spawn_level(this.realm.assets.glbs.levels[name](), false)
	}

	updated() {}

	deleted() {
		if (this.#dispose)
			this.#dispose()
	}
}

type LevelInstance = Awaited<ReturnType<typeof instance_level>>

async function instance_level(asset: AssetContainer) {
	const instanced = asset.instantiateModelsToScene()
	const [root] = instanced.rootNodes

	const get_top_level = true
	const get_children_recursively = false

	const filter_for_instancables = (node: Node) => (
		node instanceof Mesh ||
		node instanceof InstancedMesh ||
		node instanceof TransformNode
	)

	const filter_for_meshoids = (node: Node) => (
		node instanceof Mesh ||
		node instanceof InstancedMesh
	)

	const filter_for_lights = (node: Node) => (
		node instanceof Light
	)

	const top_level_nodes = (
		root.getChildren(filter_for_instancables, get_top_level)
	) as Prop[]

	const meshes = (
		root.getChildren(filter_for_meshoids, get_children_recursively)
	) as Meshoid[]

	const lights = (
		root.getChildren(filter_for_lights, get_children_recursively)
	) as Light[]

	const level = {
		instanced,
		root,
		meshes,
		lights,
		top_level_nodes,
		dispose: () => instanced.dispose(),
	}

	return {asset, level}
}

type LevelStuff = ReturnType<ReturnType<typeof setup_level_accoutrements>>

function setup_level_accoutrements(realm: HumanoidRealm, physics: boolean) {
	return ({level, asset}: LevelInstance) => {
		const disposables: (() => void)[] = []

		const static_meshes = level.meshes.filter(mesh =>
			mesh.name.includes("::ghost") ||
			mesh.material?.name.includes("::ghost")
		)

		for (const mesh of level.meshes) {

		}

		// const static_meshes = level
		// 	.meshes
		// 	.filter(mesh => !(
		// 		mesh.name.includes("feature") ||
		// 		mesh.name.includes("toy")
		// 	))

		// const dynamic_nodes = level
		// 	.top_level_nodes
		// 	.filter(node => (
		// 		node.name.includes("feature") ||
		// 		node.name.includes("toy")
		// 	))

		// const balls = level.top_level_nodes.filter(m => m.name.includes("hanging_ball"))!
		// const bags = level.top_level_nodes.filter(m => m.name.includes("hanging_heavybag"))!

		// const apply_static_physics = (meshoid: Meshoid) => {
		// 	const actor = realm.physics.trimesh(meshoid)
		// 	disposables.push(() => actor.dispose())
		// }

		// const create_hanging_physical_toy = (prop: Prop, params: {
		// 		position_offset: Vec3
		// 		scale: Vec3
		// 		density: number
		// 	}) => {

		// 	const instance = prop.instantiateHierarchy()!
		// 	const position = babylonian.to.vec3(instance.absolutePosition)
		// 	disposables.push(() => instance.dispose())

		// 	const fixture = realm.physics.fixture({position})
		// 	disposables.push(() => fixture.dispose())

		// 	const box = realm.physics.box({
		// 		position: vec3.add(position, params.position_offset),
		// 		scale: params.scale,
		// 		density: params.density,
		// 		rotation: quat.identity(),
		// 		linearDamping: .3,
		// 		angularDamping: .3,
		// 		material: undefined,
		// 	})
		// 	disposables.push(() => box.dispose())

		// 	const joint = realm.physics.joint_spherical({
		// 		bodies: [fixture.rigid, box.rigid],
		// 		anchors: [[0, 0, 0], [0, 1, 0]],
		// 	})
		// 	disposables.push(() => joint.dispose())
		// }

		// dynamic_nodes.forEach(p => p.setEnabled(false))

		// if (physics) {
		// 	static_meshes.forEach(apply_static_physics)

		// 	balls.forEach(p => create_hanging_physical_toy(p, {
		// 		position_offset: [0, -1, 0],
		// 		scale: [.75, .75, .75],
		// 		density: 1000,
		// 	}))

		// 	bags.forEach(p => create_hanging_physical_toy(p, {
		// 		position_offset: [0, -1, 0],
		// 		scale: [.5, 1.5, 1.5],
		// 		density: 1000,
		// 	}))
		// }

		return {
			asset,
			level,
			accoutrement: {
				dispose: () => {
					for (const disposer of disposables)
						disposer()
				},
			},
		}
	}
}

