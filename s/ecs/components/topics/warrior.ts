
import {Vec2} from "@benev/toolbox"
import {Component} from "../../hub.js"
import {Weapon} from "../../../models/armory/weapon.js"
import {Activity} from "../../../models/activity/exports.js"

export class Health extends Component<{
	hp: number
	bleed: number
}>{}

export class Stamina extends Component<{
	juice: number
	interruptionGametime: number
	knownMeleeAction: null | Activity.Any
}> {}

export class Inventory extends Component<{
	hands: {
		shield: boolean
		grip: Weapon.Grip
		equippedBeltSlot: number
	}
	belt: {
		slots: Weapon.Data[]
	}
}> {}

// TODO rename to CurrentActivity
export class ActivityComponent extends Component<Activity.Any | null> {}

export class NextActivity extends Component<Activity.Any | null> {}

export class MeleeAim extends Component<{
	lastGlanceNormal: Vec2
	smoothedGlanceNormal: Vec2
	angle: number
}> {}

export class MeleeIntent extends Component<{
	swing: boolean
	stab: boolean
	parry: boolean
	feint: boolean

	nextWeapon: boolean
	previousWeapon: boolean
	toggleShield: boolean
	changeGrip: boolean
}> {}

export class ProtectiveBubble extends Component<{
	active: boolean
	size: number
}> {}

