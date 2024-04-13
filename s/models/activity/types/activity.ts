
import {Maneuver} from "../exports.js"
import {Weapon} from "../../armory/weapon.js"

export type Any = Melee | Parry | Equip

export type Melee = {
	kind: "melee"
	seconds: number
	weapon: Weapon.Loadout
	cancelled: number | null
	maneuvers: Maneuver.Any[]
}

export type Parry = {
	kind: "parry"
	seconds: number
	weapon: Weapon.Loadout
	shield: boolean
	holdable: {releasedAt: number} | null
}

export type Equip = {
	kind: "equip"
	routine: "nextWeapon" | "previousWeapon" | "toggleShield" | "changeGrip"
	seconds: number
	weapon: Weapon.Loadout
}

