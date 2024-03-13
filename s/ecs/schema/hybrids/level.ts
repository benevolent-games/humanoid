
import {Node} from "@babylonjs/core/node.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Matrix} from "@babylonjs/core/Maths/math.js"
import {Light} from "@babylonjs/core/Lights/light.js"
import {explode_promise, maptool} from "@benev/slate"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {HybridComponent, Meshoid, Prop, Rapier, Vec3, babylonian, quat, vec3} from "@benev/toolbox"

import {HuLevel} from "../../../gameplan.js"
import {Nametag} from "../../../tools/nametag.js"
import {HuRealm} from "../../../models/realm/realm.js"
import {make_skybox} from "../../../tools/make_skybox.js"
import {make_envmap} from "../../../tools/make_envmap.js"

export class Level extends HybridComponent<HuRealm, {level: HuLevel}> {
	#dispose: (() => void) | null = null
	#promise = explode_promise<void>()

	get #levelplan() {
		return this.realm.gameplan.levels[this.state.level]
	}

	get doneLoading() {
		return this.#promise.promise
	}

	#make_level_disposer = (stuff: LevelStuff) => {
		this.#dispose = () => {

			// TODO this deletes the glb
			stuff.asset.dispose()

			stuff.accoutrement.dispose()
			stuff.level.dispose()
		}
	}

	#spawn_level(promise: Promise<AssetContainer>, physics: boolean) {
		return promise
			.then(instance_level)
			.then(setup_thin_instances)
			.then(setup_level_accoutrements(this.realm, physics))
			.then(this.#make_level_disposer)
			.then(() => this.#promise.resolve())
	}

	skybox = (() => {
		const {sky} = this.#levelplan
		return make_skybox({
			scene: this.realm.scene,
			links: sky.images,
			yaw: sky.rotation,
			size: sky.size,
		})
	})()

	envmap = (() => {
		const {env} = this.#levelplan
		return make_envmap(
			this.realm.scene,
			env.url,
			env.rotation,
		)
	})()

	created() {
		const {state: {level}} = this
		const {glb} = this.realm.gameplan.levels[level]
		this.#spawn_level(this.realm.loadingDock.loadGlb(glb), glb.physics)
	}

	updated() {}

	deleted() {
		this.skybox.dispose()
		this.envmap.dispose()
		if (this.#dispose)
			this.#dispose()
	}
}

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////

type LevelInstance = Awaited<ReturnType<typeof instance_level>>

async function instance_level(asset: AssetContainer) {
	const instanced = asset.instantiateModelsToScene()
	const [root] = instanced.rootNodes

	const get_top_level = true
	const get_children_recursively = false

	const filter_for_props = (node: Node) => (
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
		root.getChildren(filter_for_props, get_top_level)
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

function trace_paternity(meshes: Meshoid[]) {
	const paternity = new Map<Mesh, InstancedMesh[]>()
	for (const mesh of meshes) {
		if (mesh instanceof InstancedMesh) {
			const instances = maptool(paternity).guarantee(mesh.sourceMesh, () => [])
			instances.push(mesh)
		}
	}
	return paternity
}

function thinnify(daddy: Mesh, babies: InstancedMesh[]) {
	const inverse_parent_matrix = daddy.computeWorldMatrix(true).invert()
	const matrices = new Float32Array(16 * (1 + babies.length))
	Matrix.IdentityReadOnly.copyToArray(matrices, 0)
	babies.forEach((instance, i) => {
		const world = instance.computeWorldMatrix(true)
		const relative = world.multiply(inverse_parent_matrix)
		relative.copyToArray(matrices, 16 * (1 + i))
		instance.dispose()
	})
	daddy.thinInstanceSetBuffer("matrix", matrices, 16)
	daddy.thinInstanceRefreshBoundingInfo()
}

function is_marked_thin(meshoid: Meshoid) {
	return !!(
		Nametag.parse(meshoid.name).tag("thin") ||
		(meshoid.material && Nametag.parse(meshoid.material.name).tag("thin"))
	)
}

function setup_thin_instances(params: LevelInstance) {
	const {level} = params
	const paternity = trace_paternity(level.meshes)
	for (const [daddy, babies] of paternity)
		if (is_marked_thin(daddy))
			thinnify(daddy, babies.filter(is_marked_thin))
	return params
}

function setup_level_accoutrements(realm: HuRealm, enable_physics: boolean) {
	return ({level, asset}: LevelInstance) => {
		const disposables: (() => void)[] = []
		const {physics} = realm
		const {groups} = physics

		const static_meshes = level
			.meshes
			.filter(mesh => !(
				mesh.name.includes("feature") ||
				mesh.name.includes("toy")
			))
			.filter(mesh => !Nametag.query(mesh, "ghost"))

		const dynamic_nodes = level
			.top_level_nodes
			.filter(node => (
				node.name.includes("feature") ||
				node.name.includes("toy")
			))

		const balls = level.top_level_nodes.filter(m => m.name.includes("hanging_ball"))
		const bags = level.top_level_nodes.filter(m => m.name.includes("hanging_heavybag"))
		const boxes = level.top_level_nodes.filter(m => m.name.includes("toy_cube"))

		const apply_static_physics = (meshoid: Meshoid) => {
			const actor = physics.prefabs.trimesh({
				meshoid,
				groups: physics.grouper.specify({
					filter: [groups.all],
					membership: [groups.standard, groups.level],
				}),
			})
			actor.collider.setActiveCollisionTypes(Rapier.ActiveCollisionTypes.ALL)
			physics.trimesh_colliders.add(actor.collider)
			disposables.push(() => {
				actor.dispose()
				physics.trimesh_colliders.delete(actor.collider)
			})
		}

		const create_box_toy = (prop: Prop, params: {scale: Vec3, density: number}) => {
			const instance = prop.instantiateHierarchy()!
			const position = vec3.add(babylonian.to.vec3(instance.absolutePosition), [0, 1, 0])
			disposables.push(() => instance.dispose())

			const box = physics.prefabs.box({
				position,
				rotation: quat.identity(),
				ccd: false,
				groups: physics.grouper.specify({
					filter: [groups.all],
					membership: [groups.standard, groups.dynamic],
				}),
				contact_force_threshold: 0.02,
				scale: params.scale,
				density: params.density,
				linearDamping: .3,
				angularDamping: .3,
				material: null,
			})
			disposables.push(box.dispose)

			physics.dynamics.set(box.collider, box)
			disposables.push(() => physics.dynamics.delete(box.collider))

			instance.position.set(...position)
			instance.setParent(box.mesh)
		}

		const create_hanging_physical_toy = (prop: Prop, params: {
				position_offset: Vec3
				scale: Vec3
				density: number
			}) => {

			const instance = prop.instantiateHierarchy()!
			const position = babylonian.to.vec3(instance.absolutePosition)
			disposables.push(() => instance.dispose())

			const fixture = physics.prefabs.fixture({position, material: null})
			disposables.push(() => fixture.dispose())

			const box = physics.prefabs.box({
				position: vec3.add(position, params.position_offset),
				rotation: quat.identity(),
				ccd: false,
				contact_force_threshold: 0.02,
				scale: params.scale,
				density: params.density,
				linearDamping: .3,
				angularDamping: .3,
				material: null,
				groups: physics.grouper.specify({
					filter: [groups.all],
					membership: [groups.standard, groups.dynamic],
				}),
			})
			box.collider.setActiveCollisionTypes(Rapier.ActiveCollisionTypes.ALL)
			disposables.push(() => box.dispose())
			instance.setParent(box.mesh)

			physics.dynamics.set(box.collider, box)
			disposables.push(() => physics.dynamics.delete(box.collider))

			const joint = realm.physics.prefabs.joint_spherical({
				bodies: [fixture.rigid, box.rigid],
				anchors: [[0, 0, 0], [0, 1, 0]],
			})
			disposables.push(() => joint.dispose())
		}

		dynamic_nodes.forEach(p => p.setEnabled(false))

		if (enable_physics) {
			static_meshes.forEach(apply_static_physics)

			balls.forEach(p => create_hanging_physical_toy(p, {
				position_offset: [0, -1, 0],
				scale: [.75, .75, .75],
				density: 1000,
			}))

			bags.forEach(p => create_hanging_physical_toy(p, {
				position_offset: [0, -1, 0],
				scale: [.5, 1.5, .5],
				density: 1000,
			}))

			boxes.forEach(p => create_box_toy(p, {
				scale: [.9, .9, .9],
				density: 1000,
			}))
		}

		return {
			asset,
			level,
			accoutrement: {
				dispose: () => {
					for (const disposer of disposables.toReversed())
						disposer()
				},
			},
		}
	}
}

