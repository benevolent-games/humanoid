
import {template, html, easypage, startup_scripts_with_dev_mode, read_file} from "@benev/turtle"

export default template(async basic => {
	const path = basic.path(import.meta.url)
	const commitHash = (await read_file("x/commit-hash.txt")).trim()

	return easypage({
		path,
		css: "index.css",
		title: "@benev/humanoid",
		head: html`
			<link rel="icon" href="https://benevolent.games/assets/benevolent.svg"/>
			<meta data-commit-hash="${commitHash}"/>
			${startup_scripts_with_dev_mode(path)}
		`,
		body: html`
			<benev-humanoid></benev-humanoid>
		`,
	})
})

