
export type Any = Swing | Stab

export type Swing = {
	technique: "swing"
	angle: number
	comboable: boolean
}

export type Stab = {
	comboable: boolean
	technique: "stab"
}

