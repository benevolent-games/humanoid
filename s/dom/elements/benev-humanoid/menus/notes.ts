
import {menu} from "@benev/toolbox"
import {css, html} from "@benev/slate"
import {nexus} from "../../../../nexus.js"
import {HuLevel} from "../../../../gameplan.js"
import {Zone} from "../../../../models/zone/zone.js"
import {HumanoidRealm} from "../../../../models/realm/realm.js"

export const notesMenu = (realm: HumanoidRealm, zone: Zone) => (
	menu("notes", () => NotesMenu([realm, zone]))
)

export const NotesMenu = nexus.shadow_view(use => (
		_realm: HumanoidRealm,
		zone: Zone,
	) => {

	use.name("notes-menu")

	use.styles(css`
		:host > * + * { margin-top: 1em; }
		section { padding: 1em; }
		.current-level { color: #e6b078; }
		h1 {
			vertical-align: middle;
			> small {
				opacity: 0.5;
				font-size: 0.6em;
				font-weight: normal;
				font-family: monospace;
			}
		}
	`)

	const switchLevel = () => zone.levelSwitcher.next()
	const level = (name: HuLevel) => name === zone.levelSwitcher.current.value
		? html`<span class=current-level>${name}</span>`
		: html`<span>${name}</span>`

	return html`
		<section>
			<h1>welcome to humanoid.</h1>
			<p>the humanoid sandbox is under development.</p>
			<p>we're using it to make super cool games.</p>
			<p>join our <a target=_blank href="https://discord.gg/BnZx2utdev">discord</a> community.</p>
		</section>
		<section>
			<h1>
				<span>prepping walkthrough demoability</span>
				<small>2024-02-23</small>
			</h1>
			<p>fix ssr and ssao by reverting some optimizations.</p>
		</section>
		<section>
			<h1>
				<span>new levels.</span>
				<small>2024-02-23</small>
			</h1>
			<p>press R or <button @click="${switchLevel}">click here</button> to switch levels.</p>
			<p>we now have the ${level("gym")}, ${level("mt_pimsley")}, ${level("teleporter")}, and ${level("wrynth_dungeon")}.</p>
			<p>added the new "quality" menu.</p>
			<p><strong>thin instances!</strong> we've thinnified the foliage on mt_pimsley, for some reason some of the trees turn naked, more research is needed..</p>
		</section>
		<section>
			<h1>new notes menu</h1>
			<p>all new fancy menus system.</p>
			<p>settings menu totally redone.</p>
			<p>fixed the rendering pipeline bugs.</p>
			<p>increased precision granularity on sliders.</p>
		</section>
	`
})

