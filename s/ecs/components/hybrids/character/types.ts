
import {Prop} from "@benev/toolbox"

export type Weaponry = {
	left: Map<string, Prop>
	right: Map<string, Prop>
	referenceLeft: ReferenceWeapon
	referenceRight: ReferenceWeapon
}

export type ReferenceWeapon = {
	prop: Prop
	neutralY: number
}


