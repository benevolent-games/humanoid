
import {make_gameplan} from "../gameplan.js"
import {makeRealm} from "../models/realm/realm.js"
import {CommitHash} from "../tools/commit_hash.js"
import {determine_local_mode} from "../tools/determine_local_mode.js"
import {determine_webgpu_mode} from "../tools/determine_webgpu_mode.js"
import {determine_quality_mode} from "../tools/determine_quality_mode.js"
import {standard_glb_post_process} from "../models/glb_post_processing/standard_glb_post_process.js"
import { Rendering } from "@benev/toolbox"

/**
 * initialze 3d rendering facilities
 *  - the realm is kind of the container of the 3d world
 *  - this bootstraps our babylonjs engine and scene
 *  - we are using an op for the async operation so the ui can show a loading spinner
 */
export default async(commit: CommitHash) => {
	const local = determine_local_mode(location.href)

	const realm = await makeRealm({
		commit,
		allow_webgpu: determine_webgpu_mode(location.href),
		gameplan: make_gameplan({
			local,
			quality: determine_quality_mode(location.href, "mid"),
			root_url: local
				? "/assets"
				: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/x/assets",
		}),
	})

	const everything = Rendering.effects.everything()

	// use lower quality stuff in potato mode
	if (realm.gameplan.quality === "potato") {
		realm.stage.porthole.resolution = 0.5
		realm.stage.rendering.setEffects({
			antialiasing: {fxaa: false, samples: 0},
			scene: {
				...everything.scene,
				shadowsEnabled: false,
				environmentIntensity: 0.6,
			},
		})
	}
	else {
		realm.stage.porthole.resolution = 1.0
		realm.stage.rendering.setEffects({
			antialiasing: {fxaa: false, samples: 8},
			scene: {
				...everything.scene,
				shadowsEnabled: true,
				environmentIntensity: 0.6,
			},
		})
	}

	// our standard glb postpro will apply shaders and stuff like that,
	// before it's copied to the scene.
	realm.loadingDock.glb_post_process = standard_glb_post_process(realm)

	return realm
}

