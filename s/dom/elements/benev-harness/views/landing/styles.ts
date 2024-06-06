
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
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 42rem;
	max-height: 100%;
	margin: auto;
	padding: 2rem;
	gap: 1rem;

	overflow: auto;

	> * {
		flex: 0 0 auto;
	}
}

h1 {
	> img {
		width: 100%;
		max-width: 32rem;
		user-select: none;
		user-drag: none;
		-webkit-user-drag: none;
	}
}

.buttonbar {
	margin-top: -3em;
	display: flex;
	gap: 0.4em;
	user-select: none;

	> * {
		flex: 0 0 auto;
		background: #8884;
		color: white;
		font: inherit;
		border: none;
		padding: 1rem 2rem;
		border-radius: 0.2rem;
		text-shadow: .1em .2em .3em #0008;
		box-shadow: .2em .3em .5em #0004;

		cursor: pointer;
		opacity: 0.9;
		&:hover { opacity: 1; }

		&.play {
			padding: 1rem 4rem;
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
	font-size: 1.3rem;
	color: white;
}

footer {
	text-align: right;
}

`

