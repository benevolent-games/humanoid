
import {css, html} from "@benev/slate"
import {Game} from "../../../../types.js"
import {nexus} from "../../../../nexus.js"

export const NotesMenu = nexus.shadow_view(use => (game: Game) => {
	use.name("notes-menu")
	use.styles(css`
		.base {
			display: block;
			padding: 1em;
			> * + * { margin-top: 1em; }
		}
		h1 {
			color: #fffc;
			font-size: 1.1em;
			vertical-align: middle;
			> small {
				opacity: 0.5;
				font-size: 0.6em;
				font-weight: normal;
				font-family: monospace;
			}
		}
		code { color: #fc6; }
		hr {
			margin-left: 10%;
			margin-right: 10%;
			border: none;
			height: 2px;
			background: #fff3;
		}
	`)

	const wrap = (h: any) => html`<div class=base>${h}</div>`

	return wrap(html`
		<section class=lead>
			<h1>welcome to humanoid.</h1>
			<p>the humanoid sandbox is an open source web game template.</p>
			<p>we're building it so we can make a cool game. join our <a target=_blank href="https://discord.gg/BnZx2utdev">discord</a> community.</p>
		</section>

		<section class=controls>
			<h1>controls.</h1>
			<p>
				<code>tab</code> for menu.
				<code>wasd</code> to walk around.
				<code>shift</code> for sprint.
				<code>alt</code> for slow.
				<code>c</code> to crouch.
				<code>r</code> to switch camera angle.
				<code>t</code> to toggle human/spectator.
			</p>
		</section>

		<hr/>

		<section>
			<h1>
				<span>levels menu.</span>
				<small>2024-02-28</small>
			</h1>
			<p>now we have a level switcher menu.</p>
			<p>you'll still fall through the map if you aren't in spectator mode though, so watch out.</p>
			<p>the menu system has little back and forward buttons, with nifty hotkeys.</p>
		</section>

		<section>
			<h1>
				<span>some refinements.</span>
				<small>2024-02-27</small>
			</h1>
			<p>new tab menu system.</p>
			<p>fixed a super-annoying chrome bug which caused occasional janky mouselook-snapping.</p>
			<p>optimized all the shader images, which should improve mountainside's download time very much.</p>
		</section>

		<section>
			<h1>
				<span>the next morning</span>
				<small>2024-02-25</small>
			</h1>
			<p>this morning, lonnie and i added custom shaders for the wrynth_dungeon for water, skylights, and the liquid mercury.</p>
			<p>i added a maxLights configuration based on quality setting. fancy mode can show all the lights on the wrynth_dungeon.</p>
			<p>we gave my parents a demo, and my dad's going to make music and help us with sound effects.</p>
		</section>

		<section>
			<h1>
				<span>make humanoid great again</span>
				<small>2024-02-25</small>
			</h1>
			<p>🎉 we brought back the knight character.</p>
			<p>now all the maps have physics.</p>
			<p>alternate between knight and spectator mode</p>
			<p>level switching.</p>
			<p>thin instancing, which improves mountainside's framerate.</p>
			<p>we made mountainside shiny. it sports a fresh coat of custom shader terrain, new env lighting, etc.. it was horrible bingus to get working.</p>
			<p>fix ssr and ssao by reverting some optimizations.</p>
		</section>

		<section>
			<h1>
				<span>new levels.</span>
				<small>2024-02-23</small>
			</h1>
			<p>added four levels.</p>
			<p>added the new "quality" menu.</p>
			<p><strong>thin instances!</strong> we've thinnified the foliage on mountainside, for some reason some of the trees turn naked, more research is needed..</p>
		</section>

		<section>
			<h1>new notes menu</h1>
			<p>all new fancy menus system.</p>
			<p>settings menu totally redone.</p>
			<p>fixed the rendering pipeline bugs.</p>
			<p>increased precision granularity on sliders.</p>
		</section>
	`)
})

