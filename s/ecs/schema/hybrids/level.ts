
import {Node} from "@babylonjs/core/node.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {HumanoidRealm} from "../../../models/realm/realm.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {HybridComponent, Meshoid, Prop, Stage, Vec3, babylonian, quat, vec3} from "@benev/toolbox"

export class Level extends HybridComponent<HumanoidRealm, {asset: string}> {
	disposed = false
	disposables: (() => void)[] = []

	created() {
		const {realm, state: {asset}} = this

		if (asset === "gym") {
			load_level_glb(realm.stage, realm.links.assets.gym)
				.then(this.#prepare_physics)
		}
		else if (asset === "wrynth_dungeon") {
			load_level_glb(realm.stage, realm.links.assets.wrynth_dungeon)
				.then(this.#prepare_physics)
		}
		else {
			console.warn(`unknown environment asset "${asset}"`)
		}
	}

	#prepare_physics = (level: LevelAsset) => {
		if (this.disposed) {
			level.dispose()
			return
		}

		this.disposables.push(level.dispose)

		const static_meshes = level
			.all_meshes
			.filter(mesh => !(
				mesh.name.includes("feature") ||
				mesh.name.includes("toy")
			))

		const dynamic_nodes = level
			.top_level_nodes
			.filter(node => (
				node.name.includes("feature") ||
				node.name.includes("toy")
			))

		const balls = level.top_level_nodes.filter(m => m.name.includes("hanging_ball"))!
		const bags = level.top_level_nodes.filter(m => m.name.includes("hanging_heavybag"))!

		dynamic_nodes.forEach(p => p.setEnabled(false))
		static_meshes.forEach(this.#apply_static_physics)

		balls.forEach(p => this.#create_hanging_physical_toy(p, {
			position_offset: [0, -1, 0],
			scale: [.75, .75, .75],
			density: 1000,
		}))

		bags.forEach(p => this.#create_hanging_physical_toy(p, {
			position_offset: [0, -1, 0],
			scale: [.5, 1.5, 1.5],
			density: 1000,
		}))
	}

	#apply_static_physics = (meshoid: Meshoid) => {
		const actor = this.realm.physics.trimesh(meshoid)
		this.disposables.push(() => actor.dispose())
	}

	#create_hanging_physical_toy = (prop: Prop, params: {
			position_offset: Vec3
			scale: Vec3
			density: number
		}) => {
		const {realm} = this
		const instance = prop.instantiateHierarchy()!
		const position = babylonian.to.vec3(instance.absolutePosition)
		this.disposables.push(() => instance.dispose())

		const fixture = realm.physics.fixture({position})
		this.disposables.push(() => fixture.dispose())

		const box = realm.physics.box({
			position: vec3.add(position, params.position_offset),
			scale: params.scale,
			density: params.density,
			rotation: quat.identity(),
			linearDamping: .3,
			angularDamping: .3,
			material: undefined,
		})
		this.disposables.push(() => box.dispose())

		const joint = realm.physics.joint_spherical({
			bodies: [fixture.rigid, box.rigid],
			anchors: [[0, 0, 0], [0, 1, 0]],
		})
		this.disposables.push(() => joint.dispose())
	}

	updated() {}

	deleted() {
		this.disposed = true
		for (const dispose of this.disposables)
			dispose()
	}
}

type LevelAsset = Awaited<ReturnType<typeof load_level_glb>>

async function load_level_glb(stage: Stage, link: string) {
	const asset = await stage.load_glb(link)

	for (const light of asset.lights)
		light.intensity /= 1000

	const instanced = asset.instantiateModelsToScene()
	const [root] = instanced.rootNodes

	const get_top_level = true
	const get_children_recursively = false

	const filter_for_meshoids = (node: Node) => (
		node instanceof Mesh ||
		node instanceof InstancedMesh
	)

	const filter_for_instancables = (node: Node) => (
		node instanceof Mesh ||
		node instanceof InstancedMesh ||
		node instanceof TransformNode
	)

	const top_level_nodes = (
		root.getChildren(filter_for_instancables, get_top_level)
	) as Prop[]

	const all_meshes = (
		root.getChildren(filter_for_meshoids, get_children_recursively)
	) as Meshoid[]

	return {
		instanced,
		root,
		all_meshes,
		top_level_nodes,
		dispose: () => {
			instanced.dispose()
			asset.dispose()
		},
	}
}

