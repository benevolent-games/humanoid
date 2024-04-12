
export type Sensitivity = {

	/** arcseconds/count */
	mouse: number

	/** degrees/second */
	keys: number

	/** degrees/second */
	stick: number

	/** arcseconds/count */
	touch: number
}

export type HealthState = {
	enabled: boolean
	hp: number
	bleed: number
	stamina: number
}

