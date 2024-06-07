
import {css} from "@benev/slate"
export const styles = css`

.bg {
	position: absolute;
	inset: 0;

	display: flex;
	justify-content: center;
	align-items: center;
	background:
		linear-gradient(to bottom, #111f, #111a),
		var(--background-image) center center / cover;
}

.plate {
	font-size: max(.6em, min(2.5vw, 2.5vh, 1.5em));

	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 42em;
	max-height: 100%;
	margin: auto;
	padding: 2em;
	gap: 1em;

	overflow: auto;

	> * {
		flex: 0 0 auto;
	}
}

h1 {
	> img {
		width: 15em;
		max-width: 100%;
		user-select: none;
		user-drag: none;
		-webkit-user-drag: none;
		margin-bottom: -1.5em;
	}
}

.buttonbar {
	display: flex;
	flex-wrap: wrap;
	gap: 0.4em;
	user-select: none;

	> * {
		flex: 0 0 auto;
		background: #8884;
		color: white;
		font: inherit;
		border: none;
		padding: 1em 2em;
		border-radius: 0.2em;
		text-shadow: .1em .2em .3em #0008;
		box-shadow: .2em .3em .5em #0004;

		cursor: pointer;
		opacity: 0.9;
		&:hover { opacity: 1; }

		&.play {
			padding: 1em 4em;
			text-transform: uppercase;
			font-weight: bold;
			background: #090;
			background: linear-gradient(to bottom, #4c4, #090);
		}

		&.quality {
			margin: 0.5em 0;
			> option {
				color: #333;
				background: #eee;
			}
		}
	}
}

section {
	font-family: Caudex, serif;
	font-size: 1.3em;
	color: white;
}

footer {
	text-align: right;
}

`

