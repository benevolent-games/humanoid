
export type Any = Swing | Stab

export type Swing = {
	technique: "swing"
	angle: number
} & Base

export type Stab = {
	technique: "stab"
} & Base

type Base = {
	comboable: boolean
	phase: "windup" | "release" | "combo" | "recovery"
}

