
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
	position: absolute;
	inset: 0;
	z-index: 1;

	padding: 0 3em;
	padding-bottom: 2em;
	max-width: 64em;
	margin: auto;

	display: flex;
}

.banner {
	position: relative;
	z-index: 1;

	flex: 0 0 auto;
	width: 16em;
	height: 100%;

	display: flex;
	flex-direction: column;

	background: #080808cc;
	backdrop-filter: blur(1em);
	border-radius: 0 0 .5em .5em;
	box-shadow: .3em .3em 2em #0004;

	> img {
		margin-top: 2em;
		display: block;
		width: 100%;
		transform: scale(1.3);
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

			cursor: pointer;
			font-family: Caudex, serif;
			font-size: 1.5em;
			color: white;
			font-weight: bold;

			width: 100%;
			padding: 0.5em 1em;

			opacity: 0.8;
			transition: background 150ms linear;
			&:hover {
				opacity: 1;
				background: #8881;
			}
		}

		.benev {
			flex: 0 0 auto;
			margin-top: auto;
			> img {
				height: 1.5em;
			}
		}
	}
}

.plate {
	flex: 1 0 auto;
	margin-top: 6em;
	margin-bottom: 2em;

	background: #1118;
	backdrop-filter: blur(.5em);
	border-radius: 0 .5em .5em 0;
	box-shadow: .3em .3em 2em #0002;
}

`

