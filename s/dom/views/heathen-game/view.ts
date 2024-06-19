
import {html} from "@benev/slate"
import {Menus, Theater} from "@benev/toolbox"
import {NubStick} from "@benev/toolbox/x/tact/nubs/stick/view.js"
import {NubLookpad} from "@benev/toolbox/x/tact/nubs/lookpad/view.js"

import {styles} from "./styles.js"
import {Game} from "../../../models/realm/types.js"
import {hnexus} from "../../elements/benev-harness/nexus.js"
import {MenuSystem} from "../../elements/benev-humanoid/menus.js"
import {Overlay} from "../../elements/benev-humanoid/views/overlay/view.js"

enum Predicament {
	Menu,
	DesktopGaming,
	MobileGaming,
}

const InnerGameView = hnexus.light_view(use => (game: Game, menus: Menus) => {
	const {modes} = game.tact
	const {pointerLocker} = game.stage

	const mobile = use.signal(false)
	const predicament = use.signal(Predicament.Menu)

	const setty = use.once(() => ({
		menu() {
			predicament.value = Predicament.Menu
			pointerLocker.unlock()
			menus.open.value = true
			mobile.value = false
			modes.enable("menus").disable("humanoid")
		},
		desktopGaming() {
			predicament.value = Predicament.DesktopGaming
			pointerLocker.lock()
			menus.open.value = false
			mobile.value = false
			modes.disable("menus").enable("humanoid")
		},
		mobileGaming() {
			predicament.value = Predicament.MobileGaming
			pointerLocker.unlock()
			menus.open.value = false
			mobile.value = true
			modes.disable("menus").enable("humanoid")
		},
	}))

	use.once(() => setty.menu())

	// menu toggle keypress
	use.mount(() =>
		game.tact.inputs.universal.buttons.menu_toggle.onPressed(() => {
			if (predicament.value === Predicament.Menu)
				setty.desktopGaming()
			else
				setty.menu()
		})
	)

	// show mobile controls whenever pointer is not locked
	use.mount(() => pointerLocker.onLockChange(locked => {
		if (!locked)
			setty.menu()
	}))

	function toggley(fn: () => void) {
		return (predicament.value === Predicament.Menu)
			? fn
			: setty.menu
	}
	return Theater(
		[{
			menus,
			arrows: false,
			stage: game.stage,
			menuButton: "tab",
			onMenuClick: toggley(setty.desktopGaming),
			onMenuTouch: toggley(setty.mobileGaming),
			onBackdropClick: toggley(setty.desktopGaming),
			onBackdropTouch: toggley(setty.mobileGaming),
		}],
		{content: html`
			${Overlay([game, menus])}
			${(mobile.value || null) && html`
				<div slot=baseplate class=mobile_controls>
					${NubLookpad([game.tact.connectedDevices.lookpad])}
					${NubStick([game.tact.connectedDevices.stick])}
				</div>
			`}
		`},
	)
})

export const HeathenGame = hnexus.shadow_view(use => ({game}: {
		game: Game
	}) => {
	use.name("game")
	use.styles(styles)
	return MenuSystem(game, menus => InnerGameView(game, menus))
})

