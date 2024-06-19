
import {css} from "@benev/slate"

export const styles = css`

:host {
	display: contents;
	--duration: 500ms;
}

.blanket {
	position: absolute;
	inset: 0;
	z-index: 2;
	overflow: hidden;

	display: flex;
	justify-content: center;
	align-items: center;

	opacity: 0;
	user-select: none;
	transition: all var(--duration) ease;
	background: #111;

	.splash {
		padding: 10%;
		width: 100%;
		height: 100%;

		display: flex;
		justify-content: center;
		align-items: center;

		> img {
			width: 24em;
			max-width: 100%;
			max-height: 100%;
			transition: all var(--duration) ease;
			transform: scale(1);
		}
	}

	&[data-active] {
		opacity: 1;
		.splash > img {
			transform: scale(1.4);
		}
	}
}

`
