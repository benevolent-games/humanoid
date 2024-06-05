
import {css} from "@benev/slate"
export const styles = css`

:host {
	position: absolute;
	inset: 0;
	overflow: hidden;
}

.splash {
	z-index: 10;
	position: absolute;
	inset: 0;
	background: #111;

	& img {
		position: absolute;
		inset: 0;
		margin: auto;
		width: 100%;
		max-width: 24rem;
		min-height: 24rem;
	}

	pointer-events: none;
	opacity: 0;
	transform: scale(1.0);
	transition: all 500ms ease;

	&[data-active] {
		pointer-events: all;
		opacity: 1;
		transform: scale(1.2);
	}
}

`

