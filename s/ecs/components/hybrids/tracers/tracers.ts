
import {Material} from "@babylonjs/core/Materials/material.js"

import {Tracing} from "./types.js"
import {HybridComponent} from "../../../hub.js"
import {Weapon} from "../../../../models/armory/weapon.js"
import {apply_update_to_ribbon, establish_ribbon} from "./utils.js"

const ribbon_lifespan = 10
const ribbon_limit = 1

export type TracerUpdate = {
	gametime: number
	weaponMeta: Weapon.Meta | null
}

export class Tracers extends HybridComponent<{}> {

	#materials = {
		sheets: {
			handle: this.realm.colors.blue,
			damage: this.realm.colors.yellow,
			grace: this.realm.colors.green,
		} satisfies Record<Weapon.RibbonKind, Material>,
		edges: {
			handle: this.realm.colors.red,
			damage: this.realm.colors.red,
			grace: this.realm.colors.red,
		} satisfies Record<Weapon.RibbonKind, Material>,
	}

	#ribbons = new Set<Tracing.Ribbon>()

	#wip: null | {
		lines: Tracing.Line[]
		data: Tracing.Ribbon
		edge: null | Tracing.RibbonEdge
	}[] = null

	update(update: TracerUpdate) {
		this.#destroy_expired_ribbons(update.gametime)

		if (update.weaponMeta) {
			if (!this.#wip) this.#start_tracing(update)
			else this.#continue_tracing(update.weaponMeta)
		}
		else if (this.#wip) this.#finish_tracing()
	}

	#start_tracing(update: TracerUpdate) {
		const expiresAtGametime = update.gametime + ribbon_lifespan
		const ribbonize = (proto: Weapon.ProtoRibbon) => ({
			spec: proto,
			edge: null,
			lines: [[proto.a, proto.b] as Tracing.Line],
			data: establish_ribbon(
				this.realm.scene,
				expiresAtGametime,
				this.#materials.sheets[proto.kind],
				this.#materials.edges[proto.kind],
			),
		})
		this.#wip = update.weaponMeta!.protoRibbons.map(ribbonize)
	}

	#continue_tracing(meta: Weapon.Meta) {
		if (this.#wip) {
			meta.protoRibbons.forEach((proto, index) => {
				const ribbon = this.#wip![index]
				ribbon.lines.push([proto.a, proto.b])
				ribbon.edge = apply_update_to_ribbon(ribbon.data, ribbon.lines)
			})
		}
	}

	#finish_tracing() {
		if (this.#wip) {
			for (const ribbon of this.#wip)
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

	created() {}

	deleted() {
		const allRibbons = [
			...this.#ribbons,
			...((this.#wip ?? []).map(r => r.data) ?? []),
		]
		for (const ribbon of allRibbons)
			ribbon.dispose()
	}
}

