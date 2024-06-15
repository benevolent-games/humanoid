
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
	font-size: max(.6em, min(2vw, 2vh, 1.5em));

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

	section {
		> * + * {
			margin-top: 0.6em;
		}
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
	gap: 1em;
	user-select: none;
	align-items: center;

	> * {
		flex: 0 0 auto;
	}

	> .play {
		padding-left: 5em !important;
		padding-right: 5em !important;
	}

	> [view="quality-selector"]::part(select) {
		margin: 0.5em 0;
	}

	> em {
		font-family: Caudex, serif;
		font-size: 1.3em;
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

