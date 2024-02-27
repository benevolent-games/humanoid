
/**
 * warn users before they kill the browser tab,
 * people hit ctrl+w a lot while walking around and accidentally kill the game,
 * and this helps prevent that.
 */
export default () => {
	window.onbeforeunload = (event: Event) => {
		event.preventDefault()
		return "woah, are you sure you want to close the game?"
	}
}

