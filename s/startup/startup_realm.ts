
import {Quality} from "../tools/quality.js"
import {make_gameplan} from "../gameplan.js"
import {makeRealm} from "../models/realm/realm.js"
import {CommitHash} from "../tools/commit_hash.js"
import {determine_quality_mode} from "../tools/determine_quality_mode.js"
import {should_we_use_local_assets} from "../tools/should_we_use_local_assets.js"
import {standard_glb_post_process} from "../models/glb_post_processing/standard_glb_post_process.js"

/**
 * initialze 3d rendering facilities
 *  - the realm is kind of the container of the 3d world
 *  - this bootstraps our babylonjs engine and scene
 *  - we are using an op for the async operation so the ui can show a loading spinner
 */
export default async(commit: CommitHash) => {
	const realm = await makeRealm({
		commit,
		tickrate_hz: 60,
		gameplan: make_gameplan({
			quality: determine_quality_mode(location.href, Quality.Mid),
			root_url: should_we_use_local_assets(location.href)
				? "/assets"
				: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/x/assets",
		}),
	})

	// lower resolution for potatoes
	realm.stage.porthole.resolution = (
		realm.gameplan.quality === Quality.Potato
			? 0.5
			: 1
	)

	// our standard glb postpro will apply shaders and stuff like that,
	// before it's copied to the scene.
	realm.loadingDock.glb_post_process = standard_glb_post_process(realm)

	return realm
}

