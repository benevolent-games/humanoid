
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
			<link rel="icon" href="/assets/graphics/benevolent.svg"/>
			<link rel="stylesheet" href="${path.version.root("intro.css")}"/>
			<meta data-commit-hash="${commitHash}"/>
			${startup_scripts_with_dev_mode({
				path,
				scripts: [{module: "intro.bundle.js", bundle: "intro.bundle.min.js"}],
			})}
		`,
		body: html`
			<benev-harness></benev-harness>
		`,
	})
})

