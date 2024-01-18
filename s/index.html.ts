
import {template, html, easypage, startup_scripts_with_dev_mode} from "@benev/turtle"

export default template(async basic => {
	const path = basic.path(import.meta.url)

	return easypage({
		path,
		css: "index.css",
		title: "@benev/humanoid",
		head: html`
			<link rel="icon" href="https://benevolent.games/assets/benevolent.svg"/>
			${startup_scripts_with_dev_mode(path)}
		`,
		body: html`
			<benev-humanoid></benev-humanoid>
		`,
	})
})

