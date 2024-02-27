
import {binds} from "@benev/toolbox"

export type HumanoidBinds = ReturnType<typeof humanoid_binds>

export const humanoid_binds = () => binds(({
		mode, buttons, b, modless, shift, // alt, ctrl,
	}) => ({

	universal: mode({
		vectors: {},
		buttons: {
			menu_toggle: buttons(b("Tab")),
			respawn: buttons(b("KeyR"), modless("RMB")),
			bot_spawn: buttons(b("KeyB")),
			bot_delete: buttons(b("KeyB", shift)),
			level_swap: buttons(b("KeyY")),
		},
	}),

	humanoid: mode({
		vectors: {
			mouselook: ["mouse"],
			sticklook: ["look"],
			move: ["leftstick"],
		},
		buttons: {
			forward: buttons(modless("KeyW")),
			backward: buttons(modless("KeyS")),
			leftward: buttons(modless("KeyA")),
			rightward: buttons(modless("KeyD")),

			crouch: buttons(modless("KeyC")),
			jump: buttons(modless("Space")),

			fast: buttons(modless("ShiftLeft")),
			slow: buttons(modless("AltLeft")),

			up: buttons(modless("KeyI")),
			down: buttons(modless("KeyK")),
			left: buttons(modless("KeyJ")),
			right: buttons(modless("KeyL")),

			attack: buttons(modless("Semicolon"), modless("LMB")),

			test_bracket_left: buttons(modless("BracketLeft")),
			test_bracket_right: buttons(modless("BracketRight")),
			test_comma: buttons(modless("Comma")),
			test_period: buttons(modless("Period")),
		},
	}),
}))

