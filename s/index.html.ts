
import {template, html, easypage, startup_scripts_with_dev_mode, git_commit_hash} from "@benev/turtle"

export default template(async basic => {
	const path = basic.path(import.meta.url)
	return easypage({
		path,
		css: "index.css",
		title: "HEATHEN.gg",
		head: html`
			<link rel="icon" href="/assets/heathen-axe.webp"/>

			<link rel="preconnect" href="https://fonts.googleapis.com"/>
			<link rel="preconnect" crossorigin href="https://fonts.gstatic.com"/>
			<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caudex:ital,wght@0,400;0,700;1,400;1,700&display=swap"/>

			<meta data-commit-hash="${await git_commit_hash()}"/>

			${startup_scripts_with_dev_mode({
				path,
				scripts: [{
					module: "index.bundle.js",
					bundle: "index.bundle.min.js",
				}],
			})}
		`,
		body: html`
			<heathen-game></heathen-game>
		`,
	})
})

