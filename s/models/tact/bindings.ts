
import {Tact} from "@benev/toolbox"

export type HuBindings = ReturnType<typeof huBindings>

export const huBindings = () => Tact.bindings(({
		mode, buttons, mod, b, shift, // alt, ctrl,
	}) => ({

	universal: mode({
		vectors: {},
		buttons: {
			menu_toggle: buttons(b("Tab")),
		},
	}),

	menus: mode({
		vectors: {},
		buttons: {
			next: buttons(mod("KeyE")),
			previous: buttons(mod("KeyQ")),
		},
	}),

	humanoid: mode({
		vectors: {
			mouselook: ["mouse"],
			sticklook: ["look"],
			move: ["leftstick"],
		},
		buttons: {
			perspective: buttons(b("KeyR")),
			respawn: buttons(b("KeyT")),
			bot_spawn: buttons(mod("KeyB")),
			bot_delete: buttons(mod("KeyB", shift)),
			level_swap: buttons(mod("RightBracket")),

			forward: buttons(b("KeyW")),
			backward: buttons(b("KeyS")),
			leftward: buttons(b("KeyA")),
			rightward: buttons(b("KeyD")),

			crouch: buttons(b("KeyC")),
			jump: buttons(b("Space")),

			fast: buttons(b("ShiftLeft")),
			slow: buttons(b("AltLeft")),

			up: buttons(b("KeyI")),
			down: buttons(b("KeyK")),
			left: buttons(b("KeyJ")),
			right: buttons(b("KeyL")),

			orbit: buttons(b("KeyZ")),

			swing: buttons(b("MousePrimary"), b("Semicolon")),
			parry: buttons(b("MouseSecondary"), b("Slash")),
			stab: buttons(b("MouseTertiary"), b("KeyP")),

			test_bracket_left: buttons(b("BracketLeft")),
			test_bracket_right: buttons(b("BracketRight")),
			test_comma: buttons(b("Comma")),
			test_period: buttons(b("Period")),
		},
	}),
}))

