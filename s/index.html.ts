
import {$} from "zx"
import {template, html, easypage, startup_scripts_with_dev_mode} from "@benev/turtle"

export default template(async basic => {
	const path = basic.path(import.meta.url)
	const commitHash = (await $`git rev-parse HEAD`.quiet()).stdout.trim()

	return easypage({
		path,
		css: "index.css",
		title: "@benev/humanoid",
		head: html`
			<link rel="icon" href="https://benevolent.games/assets/benevolent.svg"/>
			<meta data-commit-hash="${commitHash}"/>
			${startup_scripts_with_dev_mode({
				path,
				scripts: [{module: "main.bundle.js", bundle: "main.bundle.min.js"}],
			})}
		`,
		body: html`
			<benev-humanoid></benev-humanoid>
		`,
	})
})

