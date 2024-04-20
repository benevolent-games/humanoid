
import {MeleeSnapshot} from "./types.js"

type Base = {
	animSnapshot: MeleeSnapshot
	done: boolean
	almostDone: boolean
}

export type Normal = {
	procedure: "normal"
} & Base

export type Feint = {
	procedure: "feint"
	feintTime: number
	feintDuration: number
	feintProgress: number
} & Base

export type Bounce = {
	procedure: "bounce"
	bounceTime: number
	bounceDuration: number
	bounceProgress: number
} & Base

export type Any = Normal | Feint | Bounce

