
import {Activity} from "../../../exports.js"
import {calculate_phase_start_in_maneuver_time} from "./utils.js"
import {ManeuverChart, MeleeSnapshot, MeleeFlow} from "./types.js"
import {query_for_melee_snapshot} from "./query_for_melee_snapshot.js"

const bounciness = 1 / 3

export function assess_melee_flow(
		activity: Activity.Melee,
		charts: ManeuverChart[],
		logicalSnapshot: MeleeSnapshot,
	): MeleeFlow.Any {

	const {seconds, cancelled} = activity
	const wasCancelled = cancelled !== null && seconds >= cancelled
	const isFeint = wasCancelled && logicalSnapshot.phase === "windup"
	const isBounce = wasCancelled && logicalSnapshot.phase === "release"

	// feint flow
	if (isFeint) {
		const since = seconds - cancelled
		const phaseStart = calculate_phase_start_in_maneuver_time(
			logicalSnapshot.chart.timing,
			logicalSnapshot.phase,
			logicalSnapshot.chart.comboIn,
		)
		const feintDuration = logicalSnapshot.time - phaseStart
		const feintProgress = since / feintDuration
		const rewind = cancelled - since
		return {
			procedure: "feint",
			feintTime: since,
			feintDuration,
			feintProgress,
			done: feintProgress >= 1,
			almostDone: true,
			animSnapshot: query_for_melee_snapshot(charts, rewind),
		}
	}

	// bounce flow
	else if (isBounce) {
		const since = seconds - cancelled
		const bounceDuration = logicalSnapshot.chart.timing.bounce
		const bounceProgress = since / bounceDuration
		const augmentedRewind = cancelled - (since * bounciness)
		return {
			procedure: "bounce",
			bounceTime: since,
			bounceDuration,
			bounceProgress,
			done: bounceProgress >= 1,
			almostDone: bounceProgress >= (2 / 3),
			animSnapshot: query_for_melee_snapshot(charts, augmentedRewind),
		}
	}

	// normal flow
	else {
		return {
			procedure: "normal",
			done: logicalSnapshot.progress >= 1,
			almostDone: logicalSnapshot.phase === "recovery",
			animSnapshot: logicalSnapshot,
		}
	}
}

