
import {Prop, babyloid, nametag} from "@benev/toolbox"

import {ReferenceWeapon, Weaponry} from "./types.js"
import {HybridComponent} from "../../../hub.js"
import {make_tracer_ensembles} from "../../../../models/tracing/ensembles.js"
import {establish_anim_coordination} from "./choreography/establish_anim_coordination.js"
import {ContainerInstance} from "../../../../models/glb_post_processing/container_instance.js"
import {prepare_character_component_parts} from "./choreography/prepare_character_component_parts.js"

export class Character extends HybridComponent<{height: number}> {

	readonly parts = prepare_character_component_parts(
		this.realm.scene,
		new ContainerInstance(this.realm.characterContainer),
		this.state.height,
	)

	readonly coordination = establish_anim_coordination(
		this.realm,
		this.parts.character,
		name => console.warn(`missing character animation "${name}"`),
	)

	readonly weaponry = ((): Weaponry => {
		const left = new Map<string, Prop>()
		const right = new Map<string, Prop>()
		for (const prop of this.parts.character.props.values()) {
			const parsed = nametag(prop.name)
			if (parsed.has("weapon")) {
				if (babyloid.is.meshoid(prop))
					prop.isVisible = false
				if (parsed.get("weapon") === "right")
					right.set(parsed.name, prop)
				else
					left.set(parsed.name, prop)
			}
		}
		const referenceWeapon = (prop?: Prop): ReferenceWeapon => {
			if (!prop) throw new Error("missing a reference weapon")
			return {prop, neutralY: prop.position.y}
		}
		return {
			left,
			right,
			referenceLeft: referenceWeapon(left.get("reference")),
			referenceRight: referenceWeapon(right.get("reference")),
		}
	})()

	readonly weaponEnsembles = make_tracer_ensembles(this.weaponry)

	set weaponGripPoint(gripPointMeters: number) {
		const applyGripPoint = (ref: ReferenceWeapon) => {
			ref.prop.position.y = ref.neutralY - gripPointMeters
		}
		applyGripPoint(this.weaponry.referenceLeft)
		applyGripPoint(this.weaponry.referenceRight)
	}

	created() {}
	updated() {}
	deleted() {
		this.parts.dispose()
		this.coordination.dispose()
	}
}

