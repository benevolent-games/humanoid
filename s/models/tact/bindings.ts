
import {Tact} from "@benev/toolbox"

export type HuBindings = ReturnType<typeof huBindings>

export const huBindings = () => Tact.bindings(({
		mode, buttons, b, modless, shift, // alt, ctrl,
	}) => ({

	universal: mode({
		vectors: {},
		buttons: {
			menu_toggle: buttons(modless("Tab")),
		},
	}),

	menus: mode({
		vectors: {},
		buttons: {
			next: buttons(b("KeyE")),
			previous: buttons(b("KeyQ")),
		},
	}),

	humanoid: mode({
		vectors: {
			mouselook: ["mouse"],
			sticklook: ["look"],
			move: ["leftstick"],
		},
		buttons: {
			perspective: buttons(modless("KeyR"), modless("MMB")),
			respawn: buttons(modless("KeyT"), modless("RMB")),
			bot_spawn: buttons(b("KeyB")),
			bot_delete: buttons(b("KeyB", shift)),
			level_swap: buttons(b("RightBracket")),

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

			orbit: buttons(modless("KeyZ")),

			parry: buttons(modless("RMB"), modless("Slash")),
			swing: buttons(modless("LMB"), modless("Semicolon")),
			stab: buttons(modless("MMB"), modless("KeyP")),

			test_bracket_left: buttons(modless("BracketLeft")),
			test_bracket_right: buttons(modless("BracketRight")),
			test_comma: buttons(modless("Comma")),
			test_period: buttons(modless("Period")),
		},
	}),
}))

