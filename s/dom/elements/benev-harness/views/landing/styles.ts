
import {css} from "@benev/slate"
export const styles = css`

.text {
	font-family: Caudex, serif;
	font-size: 21px;
}

.slice {
	width: 100%;
	max-width: 64rem;
	margin: auto;
	padding: 1rem 6rem;
}

.header {
	position: relative;
	width: 100%;
	height: 12rem;
	box-shadow: 0 1em 3em #000;

	background-size: cover;
	background-position: center center;

	.banner {
		display: block;
		position: absolute;
		object-fit: cover;
		width: 100%;
		height: 100%;
		inset: 0;
	}

	.logobox {
		position: absolute;
		inset: 0;

		.logo {
			position: absolute;
			bottom: 0;
			height: 50%;
			width: auto;
		}
	}
}

.plate {
	z-index: 1;
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 2em;

	.buttons {
		display: flex;
		gap: 0.3em;

		& button {
			cursor: pointer;
			flex: 0 0 auto;
			border: 0;
			border-radius: 0.15rem;
			background: #8888;
			color: white;
			font: inherit;
			font-size: 1.2em;
			padding: 0.5em 1em;
			text-shadow: 1px 2px 2px #0004;

			opacity: 0.9;
			&:hover { opacity: 1; }

			&.play {
				background: #0c0;
				padding: 0.5em 5em;
				text-transform: uppercase;
				font-weight: bold;
			}

			&.quality {
				margin: .5em 0;
			}
		}
	}

	.content {
		color: white;
		font-size: 1.8em;
	}

	footer {
		text-align: right;
	}
}

`

