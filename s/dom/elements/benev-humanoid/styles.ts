
import {css} from "@benev/slate"
export const styles = css`

:host {
	position: relative;
	display: block;
	width: 100%;
	height: 100%;

	--alpha: yellow;
}

canvas {
	display: block;
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	outline: 0;
}

[view="panel"] {
	position: absolute;
	inset: 0;
}

.info {
	position: absolute;
	top: 0.1em;
	right: 0.5em;
}

[view="reticule"] {
	position: absolute;
	inset: 0;
	width: 1em;
	height: 1em;
	margin: auto;
	z-index: 1;
	display: block;
	pointer-events: none;
}

.mobile_controls {
	position: absolute;
	inset: 0;
	top: 20%;
	overflow: hidden;

	& [view="nub-lookpad"] {
		display: block;
		position: absolute;
		inset: 0;
		width: unset;
		height: unset;
		border: none;
	}

	& [view="nub-stick"] {
		opacity: 0.2;

		position: absolute;
		bottom: 5%;
		left: 5%;
		aspect-ratio: 1 / 1;
		width: 20em;
		max-width: 25%;
		height: unset;
	}
}

`

