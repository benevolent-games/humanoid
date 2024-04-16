
import {babyloid} from "@benev/toolbox"
import {behavior, system} from "../hub.js"
import {gimbaltool} from "../../tools/gimbaltool.js"
import {Melee} from "../../models/attacking/melee.js"
import {ActivityComponent, Inventory, MeleeAction} from "../components/topics/warrior.js"
import {Character} from "../components/hybrids/character/character.js"
import {InventoryManager} from "../../models/armory/inventory-manager.js"
import {sync_character_anims} from "../components/hybrids/character/choreography/sync_character_anims.js"
import {apply_adjustments, swivel_effected_by_glance} from "../components/hybrids/character/choreography/calculations.js"
import {Ambulation, Choreography, Gimbal, Intent, Perspective, Position, GimbalSway, Speeds} from "../components/plain_components.js"

export const choreography = system("humanoid", () => [
	behavior("sync babylon parts")
		.select({Character, Position, GimbalSway})
		.logic(() => ({components: {character, position, gimbalSway}}) => {
			const q = babyloid.to.quat(
				gimbaltool(gimbalSway.gimbal)
					.quaternions().horizontal
			)
			character.parts.position.set(...position)
			character.parts.rotation.set(...q)
		}),

	behavior("set swivel")
		.select({Choreography, Intent})
		.logic(() => ({components: {choreography, intent}}) => {
			choreography.swivel = swivel_effected_by_glance(
				choreography.swivel,
				intent.glance,
			)
		}),

	behavior("set visibility of active weapon")
		.select({Character, Inventory})
		.logic(() => ({components: {character, inventory}}) => {
			const shieldMesh = character.weaponry.left.get("shield")
			const {shield, weaponName} = new InventoryManager(inventory)

			if (shieldMesh && babyloid.is.meshoid(shieldMesh))
				shieldMesh.isVisible = shield

			for (const [name, prop] of character.weaponry.right)
				if (babyloid.is.meshoid(prop))
					prop.isVisible = name === weaponName
		}),

	behavior("animate the armature")
		.select({Character, Choreography, Ambulation, Gimbal, GimbalSway, Speeds, Perspective, Inventory, ActivityComponent})
		.logic(() => ({components: c}) => {
			const {adjustment_anims, anims, boss_anim} = c.character.coordination

			apply_adjustments(
				adjustment_anims,
				c.ambulation,
				c.choreography,
				3,
			)

			const {weapon, shield, grip} = new InventoryManager(c.inventory)

			sync_character_anims({
				anims,
				shield,
				boss_anim,
				gripName: grip,
				choreo: c.choreography,
				ambulatory: c.ambulation,
				perspective: c.perspective,
				gimbal: c.gimbalSway.gimbal,
				speeds: {...c.speeds, creep: 1.5},
				meleeWeights: c.meleeAction?.weights ?? Melee.zeroWeights(),
			})
		}),
])

