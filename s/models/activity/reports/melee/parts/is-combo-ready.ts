
import {MeleeSnapshot} from "./types.js"
import {comboableReleaseThreshold} from "../constants.js"

export function isComboReady({
		phase, phaseProgress, chart, next,
	}: MeleeSnapshot) {

	return (
		chart.maneuver.comboable &&
		next === null &&
		phase === "release" &&
		phaseProgress >= comboableReleaseThreshold
	)
}

