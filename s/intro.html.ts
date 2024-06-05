
import {$} from "zx"
import {template, html, easypage, startup_scripts_with_dev_mode} from "@benev/turtle"

export default template(async basic => {
	const path = basic.path(import.meta.url)
	const commitHash = (await $`git rev-parse HEAD`.quiet()).stdout.trim()

	return easypage({
		path,
		dark: true,
		css: "index.css",
		title: "heathen.gg",
		head: html`
			<link rel="icon" href="https://benevolent.games/assets/benevolent.svg"/>
			<link rel="stylesheet" href="${path.version.root("intro.css")}"/>
			<meta data-commit-hash="${commitHash}"/>
			${startup_scripts_with_dev_mode({
				path,
				scripts: [{module: "intro.bundle.js", bundle: "intro.bundled.min.js"}],
			})}
		`,
		body: html`
			<h1 class=header>
				<img class=banner src="/assets/graphics/heathen-logo/banner.webp" alt=""/>
				<div class="logobox slice">
					<img class="logo" src="/assets/graphics/heathen-logo/heathen-gg.small.webp" alt="HEATHEN.GG"/>
				</div>
			</h1>
			<section class="plate slice">
				<header class=buttons>
					<button class=play>play</button>
					<button class=quality>quality</button>
				</header>
				<div class="content text">
					<p>heathen is an incredible 3d multiplayer combat game about vikings that is kinda historically accurate.</p>
				</div>
				<footer class="text">
					<p>by <a href="https://benevolent.games/">benevolent.games</a></p>
					<p>join our <a href="https://discord.gg/BnZx2utdev">discord</a></p>
				</footer>
			</section>
		`,
	})
})

