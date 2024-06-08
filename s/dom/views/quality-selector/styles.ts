
import {css} from "@benev/slate"
export const styles = css`

:host {
	display: contents;
}

select {
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

	> option {
		color: #333;
		background: #eee;
	}
}

`

