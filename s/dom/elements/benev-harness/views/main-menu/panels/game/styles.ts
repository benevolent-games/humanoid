
import {css} from "@benev/slate"

export const styles = css`

:host {
	max-width: 80em;
	gap: 2em;
}

.actionbar {
	display: flex;
	justify-content: end;
	flex-wrap: wrap;
	gap: .5em;

	> [view="quality-selector"] {
		display: block;
		margin: 0.3em 0;
	}
}

.levelselect {
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	gap: 0.5em;

	border: none;

	> button {
		position: relative;
		overflow: hidden;
		border: 0.2em solid #fff2;
		border-radius: .5em;

		background: transparent;

		width: 16em;
		max-width: 100%;
		aspect-ratio: 16 / 9;

		transition: filter 300ms ease;

		> input {
			display: none;
		}

		> span {
			position: absolute;
		}

		> .label {
			font-size: 1.5em;
			top: .2em;
			left: .2em;
			color: white;
			font-family: Caudex;
			font-weight: bold;
			text-shadow: .05em .1em .1em #0008;
		}

		> .note {
			bottom: .2em;
			right: .2em;
		}

		> img {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
			user-drag: none;
			-webkit-user-drag: none;
		}

		&[data-selected] {
			border-color: #4c4;
			.levelname, .note { color: #afa; }
		}

		&:not([data-selected]) {
			cursor: pointer;
			&:is(:hover, :focus) {
				filter: brightness(120%);
				border-color: #fff5;
			}
		}

	}
}

`

