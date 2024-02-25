
import {HybridComponent} from "@benev/toolbox"
import {HumanoidRealm} from "../../../../models/realm/realm.js"
import {prepare_choreographer_babylon_parts} from "./choreography/prepare_choreographer_babylon_parts.js"
import { establish_anim_coordination } from "./choreography/establish_anim_coordination.js"

export class Character extends HybridComponent<HumanoidRealm, {
		height: number
	}> {

	readonly parts = prepare_choreographer_babylon_parts(
		this.realm.scene,
		this.realm.character.instance(),
		this.state.height,
	)

	readonly coordination = establish_anim_coordination(
		this.realm,
		this.parts.character,
		name => console.warn(`missing character animation "${name}"`),
	)

	created() {}
	updated() {}
	deleted() {
		this.parts.dispose()
		this.coordination.dispose()
	}
}
