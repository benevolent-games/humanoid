
export type Any = Swing | Stab

export type Swing = {
	technique: "swing"
	angle: number
	comboable: boolean
}

export type Stab = {
	technique: "stab"
	angle: number
	comboable: boolean
}

