
import {css} from "@benev/slate"

export const styles = css`

:host {
	display: contents;
	--duration: 500ms;
}

.blanket {
	pointer-events: none;
	position: absolute;
	inset: 0;
	z-index: 2;
	overflow: hidden;

	display: flex;
	justify-content: center;
	align-items: center;
	padding: 10%;

	opacity: 0;
	user-select: none;
	transition: all var(--duration) ease;
	background: #111;

	.splash {
		width: 24em;
		max-width: 100%;
		max-height: 100%;
		transition: all var(--duration) ease;
		transform: scale(1);
	}

	&[data-active] {
		opacity: 1;
		.splash {
			transform: scale(1.4);
		}
	}
}

`

