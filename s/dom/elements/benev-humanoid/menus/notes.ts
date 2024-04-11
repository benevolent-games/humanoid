
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
			<h1>welcome to humanoid <code>${game.commit.short}</code>.</h1>
			<p>our mission is to make web games amazing and cool.</p>
			<p>humanoid is a work-in-progress open source web game template.</p>
			<p>join our <a target=_blank href="https://discord.gg/BnZx2utdev">discord</a> community.</p>
			<br/>

			<p><strong>it's not done yet</strong> — there's tons of stuff that's janky and incomplete, we're actively working on it.</p>
			<br/>

			<p><strong>controls</strong> —
				<code>tab</code> to toggle menu.
				<code>wasd</code> to walk around.
				<code>shift</code> for sprint.
				<code>left-click</code> to swing your sword.
				<code>middle-click</code> to stab.
				<code>right-click</code> to parry.
				<code>r</code> to change weapon grip.
				<code>x</code> to toggle your shield.
				<code>t</code> to respawn or toggle to spectator mode.
				<code>g</code> to switch camera angle.
				<code>q</code> and <code>e</code> to switch weapons.
				<code>b</code> to spawn bots (beware of lag).
				<code>shift+b</code> to delete bots.
				hold <code>z</code> to orbit the camera.
				<code>c</code> to crouch (it's broken/unfinished lol).
				<code>alt</code> to walk slow.
			</p>
		</section>

		<hr/>

		<section>
			<h1>
				<span>we're on a roll!</span>
				<small>2024-04-11</small>
			</h1>
			<p>new healthbar and stamina bar.</p>
			<p>weapons deal damage now. each weapon has a damage profile which can include "blunt", "bleed" and "pierce".</p>
			<p>we rebuilt the melee tracers system, enable them in the settings! each weapon has its own unique set of tracers, this is how we are detecting handle-hits versus blade hits, etc..</p>
			<p>added simple weapon-switching animation.</p>
			<p>we added weapon turncaps, which limits how fast you can spin while attacking, which has a big impact on how each weapon feels.</p>
			<p>you can now change your grip-mode, eg, onehander or twohander grip -- grip effects the timings and damages and general feel of each weapon, for better, or for much worse..</p>
			<p>you can now "hold" your shield up and block for an indefinite amout of time.</p>
			<p>⚠ parry is still not implemented, so beware of the false sense of security that you will get by seeing all the parry animations and parry indicators that make you feel safe... <em>you are not safe from the pimsley bots..</em></p>
		</section>

		<section>
			<h1>
				<span>🪓🛡️ new weapons and shield!</span>
				<small>2024-04-07</small>
			</h1>
			<p>shield, fists, adze, hammer, mace, hatchet, axe, longsword, and sledgehammer.</p>
			<p>you can now switch weapons.</p>
			<p>and you can toggle your shield.</p>
			<p>each weapon has its own set of windup/release/recovery timings, which gives each weapon its own feel.</p>
			<p>for now, they're all still using the longsword's hit-detection tracer..</p>
		</section>

		<section>
			<h1>
				<span>baby steps.</span>
				<small>2024-04-05</small>
			</h1>
			<p>added bounce-back animation when you hit something with your sword.</p>
			<p>fixed arms clipping through camera during attack animations.</p>
			<p>disabled all levels except gym and viking_village, for now at least.</p>
			<p>when you switch levels, it now forces you into spectator mode so you don't fall through the map.</p>
			<p><a target="_blank" href="https://github.com/naderslr">nader</a> from <a target="_blank" href="https://twitter.com/EasyAimTrainer">easyaim</a> helped us optimize our renderloop.</p>
			<p>removed obsolete tickrate indicator.</p>
			<p>desynchronized canvas to reduce latency.</p>
			<p>set babylon to intermediate optimization mode.</p>
			<p>now using raw mouse input via <code>pointerrawupdate</code> in browsers that <a target="_blank" href="https://caniuse.com/?search=pointerrawupdate">support it.</a></p>
		</section>

		<section>
			<h1>
				<span>mobile controls, reworked animations.</span>
				<small>2024-04-04</small>
			</h1>
			<p>lonnie reworked the animations, so now your weapon swings and stabs actually aim at your reticle in the center of your screen.</p>
			<p>now you can play the game on your phone. it's a crude first-draft, but when you use a touch screen the game enters a "mobile" mode where you get a thumbstick on the left and you can touch-drag anywhere else to control your aim. you can't sprint or attack yet, i'll slowly chip away at this in my "off time" so to speak.</p>
			<p>improved ultrawide monitor support: the ui and menu system is now constrained to 16/9 so it stays centered on your screen.</p>
		</section>

		<section>
			<h1>
				<span>viking village.</span>
				<small>2024-03-31</small>
			</h1>
			<p>so, we added lonnie's work-in-progress viking village level.</p>
			<p>you can now spawn dumb bots to play with. be careful, they are dangerous and might kill you.</p>
			<p>i rewrote the ecs framework, we're now on "ecs7".</p>
			<p>added new settings for melee tracers.</p>
			<p>slowed down walking/sprinting speeds a little.</p>
		</section>

		<section>
			<h1>
				<span>full 270-degree attack system.</span>
				<small>2024-03-24</small>
			</h1>
			<p>now you can swing your sword in any direction, except straight up/down.</p>
			<p>you can also parry and stab.</p>
			<p>added a new 'settings' menu, where you can change your mouse sensitivity and set reticle preferences.</p>
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

