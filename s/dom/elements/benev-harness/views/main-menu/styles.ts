
import {css} from "@benev/slate"
export const styles = css`

video {
	position: absolute;
	inset: 0;
	object-fit: cover;
	width: 100%;
	height: 100%;
}

.container {
	container: base / inline-size;

	font-size: calc(.5em + .5vw);
	position: absolute;
	inset: 0;
	z-index: 1;

	display: flex;
	width: calc(64rem + 30vw);
	max-width: 100%;
	margin: auto;
	padding: 0 4em;
	padding-bottom: 2em;
}

.banner {
	position: relative;
	z-index: 1;

	flex: 0 0 auto;
	width: 16em;
	height: 100%;
	max-height: 72em;

	display: flex;
	flex-direction: column;

	background: #080808cc;
	backdrop-filter: blur(1em);
	border-radius: 0 0 .5em .5em;
	box-shadow: .3em .3em 2em #0004;

	> img {
		pointer-events: none;
		margin-top: 3.5em;
		display: block;
		width: 100%;
		transform: translate(33%, 0) scale(2);
	}

	> nav {
		flex: 1;
		display: flex;
		flex-direction: column;

		> button {
			text-align: center;
			display: flex;
			justify-content: center;
			background: transparent;
			border: none;
			font: inherit;
			text-shadow: .1em .1em .2em #0008;

			cursor: pointer;
			font-family: Caudex, serif;
			font-size: 1.5em;
			color: white;
			font-weight: bold;

			width: 100%;
			padding: 0.5em 1em;

			opacity: 0.6;

			&:hover {
				opacity: 1;
			}

			&[data-selected] {
				cursor: default;
				opacity: 1;
				background: #a00;
				background: linear-gradient(to bottom, #f22, #800);
			}
		}

		.exit {
			margin-top: auto;
			margin-bottom: .3em;
		}

		.benev {
			flex: 0 0 auto;
			> img {
				height: 1.5em;
			}
		}
	}
}

.plate {
	overflow: auto;

	flex: 1 1 auto;
	margin-top: 8em;
	margin-bottom: 2em;

	padding: 2em;
	max-height: 58em;

	background: #1118;
	backdrop-filter: blur(.5em);
	border-radius: 0 .5em .5em 0;
	box-shadow: .3em .3em 2em #0002;

	.content {
		font-size: max(1em, 1rem);
	}
}

`

