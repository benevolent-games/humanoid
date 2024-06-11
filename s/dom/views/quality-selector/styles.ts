
import {css} from "@benev/slate"
export const styles = css`

:host {
	display: block;
	position: relative;
	height: auto;
	width: max-content;
}

select {
	width: 100%;
	height: 100%;

	padding: .5em 1em;
	border-radius: 0.2em;
	text-align: center;

	background: #8884;
	color: white;
	font: inherit;
	border: none;
	text-shadow: .1em .2em .3em #0008;
	box-shadow: .2em .3em .5em #0004;

	cursor: pointer;
	opacity: 0.9;
	&:hover { opacity: 1; }

	> option {
		color: #333;
		background: #eee;
	}
}

`

