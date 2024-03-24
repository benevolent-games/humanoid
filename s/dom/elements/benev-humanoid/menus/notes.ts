
import {css, html} from "@benev/slate"
import {Game} from "../../../../types.js"
import {nexus} from "../../../../nexus.js"

export const NotesMenu = nexus.shadow_view(use => (_game: Game) => {
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
			display: block;
			margin: 2em 10% !important;
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
				<code>tab</code> to toggle menu.
				<code>wasd</code> to walk around.
				<code>shift</code> for sprint.
				<code>alt</code> to walk slow.
				<code>c</code> to crouch.
				hold <code>z</code> to orbit the camera.
				<code>left-click</code> to swing your sword.
				<code>middle-click</code> to stab.
				<code>right-click</code> to parry.
				<code>r</code> to switch camera angle.
				<code>t</code> to toggle human/spectator.
			</p>
		</section>

		<hr/>

		<section>
			<h1>
				<span>full 270-degree attack system.</span>
				<small>2024-03-24</small>
			</h1>
			<p>now you can swing your sword in any direction, except straight up/down.</p>
			<p>you can also parry and stab.</p>
			<p>added a new 'settings' menu, where you can change your mouse sensitivity and set reticule preferences.</p>
		</section>

		<section>
			<h1>
				<span>we fixed pimsley's butt.</span>
				<small>2024-03-14</small>
			</h1>
			<p>pimsley's leg/hip swiveling mechanics have been improved.</p>
			<p>we're in the middle of reworking pimsley's animations, so some stuff is a bit janky.</p>
			<p>implemented dual-ribbon sword tracing. the outer-part of the ribbon is a grace-zone that is allowed to clip through the environment, but can still deal damage.</p>
		</section>

		<section>
			<h1>
				<span>improved sword tracing.</span>
				<small>2024-03-13</small>
			</h1>
			<p>today when you swing your sword you'll see a pretty ribbon representing the path of your blade.</p>
			<p>hitting a part of the environment will cancel the attack.</p>
			<p>if you're nimble, you can strike the hanging heavy bags and watch them react.</p>
		</section>

		<section>
			<h1>
				<span>wip sword tracing.</span>
				<small>2024-03-12</small>
			</h1>
			<p>wip sword tracing.</p>
			<p>today you'll see a tracer on the sword. i'm starting to work on its collision detection.</p>
		</section>

		<section>
			<h1>
				<span>fixed stuck keys.</span>
				<small>2024-03-10</small>
			</h1>
			<p>rewrote our user input systems, and fixed the stuck-keys issue (when opening a menu or clicking outside the game window).</p>
			<p>fixed ijkl keylook sensitivity.</p>
		</section>

		<section>
			<h1>
				<span>added mt_finny level prototype.</span>
				<small>2024-03-09</small>
			</h1>
			<p>it still has some issues.</p>
			<p>totally rewrote the physics integration.. i spent too long finagling it.. at least i added a cube to the gym.</p>
		</section>

		<section>
			<h1>
				<span>sword attack.</span>
				<small>2024-03-03</small>
			</h1>
			<p>added left-click to play sword attack animation. it just phases through stuff, doesn't interact with anything.. yet..</p>
		</section>

		<section>
			<h1>
				<span>fixes and refinements.</span>
				<small>2024-03-01</small>
			</h1>
			<p>increased sprinting speed, but slower sprinting animation.</p>
			<p>capped the sway effect.</p>
			<p>fixed the flickery lagspike issue.</p>
			<p>fixed the crazy headcrouching bug.</p>
			<p>refactored gimbal code to be radian-based, so mouse sensitivity has changed.</p>
		</section>

		<section>
			<h1>
				<span>pimsley improvements.</span>
				<small>2024-02-29</small>
			</h1>
			<p>fixed the triangle bug when jumping.</p>
			<p>added leading weapon sway effect.</p>
			<p>added middle-click bind to switch cam.</p>
			<p>added crude orbit cam feature via z key.</p>
			<p>unfortunately there's some unseemly choppy flickery stuff going on right now, hopefully i can fix that next day.</p>
		</section>

		<section>
			<h1>
				<span>🏃 pimsley.</span>
				<small>2024-02-29</small>
			</h1>
			<p>pimsley is our new base character. he is the perfect man and has zero flaws. men want to be him, and women want to sleep with him.</p>
			<p>first person view. it's crude and janky, but it's awesome. press R while you're pimsley to try it out. you can see your feets.</p>
			<p>new hip swivel and leg readjustment animations.</p>
			<p>crouching while walking in third person causes a hilarious bug with your head, among other quirks..</p>
			<p>level switching now puts you into spectator mode. on mountainside you'll still have to fly up until you're above the ground.</p>
		</section>

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
				<span>🎉 make humanoid great again</span>
				<small>2024-02-25</small>
			</h1>
			<p>we brought back the knight character.</p>
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

