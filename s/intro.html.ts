
import {$} from "zx"
import {template, html, easypage, startup_scripts_with_dev_mode} from "@benev/turtle"

export default template(async basic => {
	const path = basic.path(import.meta.url)
	const commitHash = (await $`git rev-parse HEAD`.quiet()).stdout

	return easypage({
		path,
		css: "intro.css",
		title: "heathen.gg",
		head: html`
			<link rel="icon" href="https://benevolent.games/assets/benevolent.svg"/>
			<meta data-commit-hash="${commitHash}"/>
			${startup_scripts_with_dev_mode(path, {
				script: "intro.js",
				script_bundle: "intro.bundle.min.js",
				importmap: "importmap.json",
				es_module_shims: "node_modules/es-module-shims/dist/es-module-shims.wasm.js",
			})}
		`,
		body: html`
			<div>hello</div>
		`,
	})
})

