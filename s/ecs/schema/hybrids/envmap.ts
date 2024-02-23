
import {HybridComponent} from "@benev/toolbox"
import {HumanoidRealm} from "../../../models/realm/realm.js"

export class Envmap extends HybridComponent<HumanoidRealm, {}> {
	envmap = this.realm.assets.envmaps.wrynth_interior()
	created() {}
	updated() {}
	deleted() {
		this.envmap.dispose()
	}
}

