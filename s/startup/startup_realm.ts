
import {Quality} from "../tools/quality.js"
import {make_gameplan} from "../gameplan.js"
import {makeRealm} from "../models/realm/realm.js"
import {CommitHash} from "../tools/commit_hash.js"
import {determine_local_mode} from "../tools/determine_local_mode.js"
import {determine_webgpu_mode} from "../tools/determine_webgpu_mode.js"

/**
 * initialze 3d rendering facilities
 *  - the realm is kind of the container of the 3d world
 *  - this bootstraps our babylonjs engine and scene
 *  - we are using an op for the async operation so the ui can show a loading spinner
 */
export default async(commit: CommitHash, quality: Quality) => {
	const local = determine_local_mode(location.href)
	return makeRealm({
		commit,
		allow_webgpu: determine_webgpu_mode(location.href),
		gameplan: make_gameplan({
			local,
			quality,
			root_url: local
				? "/assets"
				: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/x/assets",
		}),
	})
}

