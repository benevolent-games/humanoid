
import {Meshoid, Vec3, logSlow} from "@benev/toolbox"
import {Material} from "@babylonjs/core/Materials/material.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

import {Tracing} from "./types.js"
import {HybridComponent} from "../../../hub.js"
import {Weapon} from "../../../../models/armory/weapon.js"
import {apply_update_to_ribbon, establish_ribbon} from "./utils.js"

const ribbon_lifespan = 10

export type TracerUpdate = {
	gametime: number
	shape: Weapon.Shape
	releasePhase: boolean
	referenceWeapon: Meshoid
}

export class Tracers extends HybridComponent<{
		// releasePhase: boolean
		// weaponShape: Weapon.Shape
	}> {

	#refbox = (() => {
		const box = MeshBuilder.CreateBox("refbox", {size: 1}, this.realm.scene)
		// box.showBoundingBox = true
		box.material = this.realm.colors.magenta
		return box
	})()

	#materials = {
		sheets: {
			handle: this.realm.colors.blue,
			danger: this.realm.colors.green,
			grace: this.realm.colors.yellow,
		} satisfies Record<Weapon.RibbonKind, Material>,
		edges: {
			handle: this.realm.colors.red,
			danger: this.realm.colors.red,
			grace: this.realm.colors.red,
		} satisfies Record<Weapon.RibbonKind, Material>,
	}

	#ribbons = new Set<Tracing.Ribbon>()

	#wip: null | {
		referenceWeapon: Meshoid
		ribbons: {
			spec: Weapon.Ribbon
			data: Tracing.Ribbon
			edge: null | Tracing.RibbonEdge
			lines: Tracing.Line[]
		}[]
	} = null

	update(update: TracerUpdate) {
		this.#destroy_expired_ribbons(update.gametime)
		this.#make_refbox_fit_weapon_shape(update)

		if (update.releasePhase) {
			if (!this.#wip) this.#start_tracing(update)
			else this.#continue_tracing()
		}
		else if (this.#wip) this.#finish_tracing()
	}

	#start_tracing(update: TracerUpdate) {
		const shape = update.shape
		const expiresAtGametime = update.gametime + ribbon_lifespan
		const ribbonize = (spec: Weapon.Ribbon) => ({
			spec,
			edge: null,
			lines: [[spec.a, spec.b] as Tracing.Line],
			data: establish_ribbon(
				this.realm.scene,
				expiresAtGametime,
				this.#materials.sheets[spec.kind],
				this.#materials.edges[spec.kind],
			),
		})
		console.log("START TRACING")
		this.#wip = {
			referenceWeapon: update.referenceWeapon,
			ribbons: [
				...shape.swingRibbons.map(ribbonize),
				...shape.stabRibbons.map(ribbonize),
			],
		}
	}

	#continue_tracing() {
		console.log("...tracing...")
		if (this.#wip) {
			for (const ribbon of this.#wip.ribbons) {
				ribbon.lines.push([ribbon.spec.a, ribbon.spec.b])
				ribbon.edge = apply_update_to_ribbon(ribbon.data, ribbon.lines)
			}
		}
	}

	#finish_tracing() {
		console.log("STOP TRACING")
		if (this.#wip) {
			for (const ribbon of this.#wip.ribbons)
				this.#ribbons.add(ribbon.data)
			this.#wip = null
		}
	}

	#destroy_expired_ribbons(gametime: number) {
		for (const ribbon of this.#ribbons) {
			if (gametime > ribbon.expiresAtGametime) {
				ribbon.dispose()
				this.#ribbons.delete(ribbon)
			}
		}
	}

	#make_refbox_fit_weapon_shape(update: TracerUpdate) {
		const box = this.#refbox
		box.position.set(...update.shape.offset)
		box.scaling.set(...update.shape.size)
		box.parent = update.referenceWeapon
	}

	created() {}

	deleted() {
		this.#refbox.dispose()
		const allRibbons = [
			...this.#ribbons,
			...(this.#wip?.ribbons.map(r => r.data) ?? []),
		]
		for (const ribbon of allRibbons)
			ribbon.dispose()
	}
}

