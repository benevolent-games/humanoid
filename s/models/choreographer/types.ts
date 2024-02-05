
export type Choreography = {
	swivel: number
	settings: ChoreographySettings
	adjustment: null | ChoreoSwivelAdjustment
}

export type ChoreographySettings = {
	swivel_duration: number
	swivel_readjustment_margin: number
}

export type AdjustmentDirection = "left" | "right"

export type ChoreoSwivelAdjustment = {
	initial_swivel: number
	direction: AdjustmentDirection
	duration: number
	progress: number
}

export type AdjustmentAnims = {
	start: (adjustment: ChoreoSwivelAdjustment) => void
	stop: (adjustment: ChoreoSwivelAdjustment) => void
	update: (adjustment: ChoreoSwivelAdjustment) => void
}

