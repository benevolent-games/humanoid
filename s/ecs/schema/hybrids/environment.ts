
import {HumanoidRealm} from "../../../models/realm/realm.js"
import {HybridComponent, Meshoid, Prop, Vec3, babylonian, quat, vec3} from "@benev/toolbox"

export class Environment extends HybridComponent<HumanoidRealm, {asset: string}> {
	disposables: (() => void)[] = []

	created() {
		const {disposables, realm, state: {asset}} = this

		if (asset === "gym") {
			const gym = realm.spawn.gym()
			disposables.push(gym.dispose)

			const static_meshes = gym
				.all_meshes
				.filter(mesh => !(
					mesh.name.includes("feature") ||
					mesh.name.includes("toy")
				))

			const dynamic_nodes = gym
				.top_level_nodes
				.filter(node => (
					node.name.includes("feature") ||
					node.name.includes("toy")
				))

			const balls = gym.top_level_nodes.filter(m => m.name.includes("hanging_ball"))!
			const bags = gym.top_level_nodes.filter(m => m.name.includes("hanging_heavybag"))!

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
		else {
			console.warn(`unknown environment asset "${asset}"`)
		}
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
		for (const dispose of this.disposables)
			dispose()
	}
}

