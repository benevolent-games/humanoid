
import {HybridComponent} from "@benev/toolbox"
import {make_envmap} from "../../../tools/make_envmap.js"
import {HumanoidRealm} from "../../../models/realm/realm.js"

export class Envmap extends HybridComponent<HumanoidRealm, {}> {
	envmap = make_envmap(
		this.realm.stage.scene,
		this.realm.links.envmap,
	)
	created() {}
	updated() {}
	deleted() {
		this.envmap.dispose()
	}
}

