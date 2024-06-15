
import {Plan} from "../../../../../models/planning/plan.js"

export type LoadingSplash<W = any> = {
	kind: "splash"
	workload: Promise<W>
	onReady: (work: W) => void
	onDone: () => void
}

export type LoadingLevel<W = any> = {
	kind: "level"
	level: Plan.Level
	workload: Promise<W>
	onReady: (work: W) => void
	onDone: () => void
}

export type LoadingScreen<W = any> = LoadingSplash<W> | LoadingLevel<W>

export function asLoadingScreen<W>(loading: LoadingScreen<W>) {
	return loading
}

