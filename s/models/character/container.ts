
import {CharacterInstance} from "./instance.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {animation_association} from "./utils/animation_association.js"

export class CharacterContainer {
	#container: AssetContainer

	constructor(container: AssetContainer) {
		this.#container = container
		animation_association.fix(container.animationGroups)
		animation_association.mark(container.animationGroups)
	}

	instance() {
		return new CharacterInstance(this.#container)
	}
}

