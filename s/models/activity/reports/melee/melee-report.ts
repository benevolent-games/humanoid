
import {Activity} from "../../exports.js"
import {MeleeReport} from "./parts/types.js"
import {assess_melee_flow} from "./parts/assess_melee_flow.js"
import {generate_maneuver_charts} from "./parts/generate_maneuver_charts.js"
import {query_for_melee_snapshot} from "./parts/query_for_melee_snapshot.js"

// the melee activity itself contains a minimal set of high-level data,
// from which we derive a report which tells us more detail.
export function meleeReport(activity: Activity.Melee): MeleeReport {

	// we compute maneuver charts, which gives us more detail
	// about the maneuvers, their timings, and their relationships.
	const charts = generate_maneuver_charts(
		activity.maneuvers,
		activity.weapon,
	)

	// we take a snapshot, which has information about
	// a specific point in time within the activity.
	// this snapshot is the one our game logic will be concerned with.
	const logicalSnapshot = query_for_melee_snapshot(
		charts,

		// if the attack is cancelled (feint or bounce),
		// our game logic's perspective is "frozen" at the moment of cancellation,
		// eg, we no longer progress onward to different phases or maneuvers.
		activity.cancelled ?? activity.seconds,
	)

	// we compute what kind of situation (flow) our melee activity is in.
	// eg, are we currently feinting, or bouncing off, etc.
	const flow = assess_melee_flow(
		activity,
		charts,
		logicalSnapshot,
	)

	return {
		activity,
		charts,
		flow,
		logicalSnapshot,
		done: flow.done,
		almostDone: flow.almostDone,

		// our animation systems don't use the logical snapshot,
		// because some of our special effects (like feinting or bouncing)
		// involves visually displaying a different point in time,
		// eg, feints and bounces are effectivelly rewinding the animations.
		// taking a whole new snapshot allows this rewinding to robustly cross
		// over maneuver boundaries if necessary.
		animSnapshot: flow.animSnapshot,
	}
}

