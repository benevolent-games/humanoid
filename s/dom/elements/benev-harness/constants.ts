
import {url_replace_extension} from "../../../tools/url_replace_extension.js"

export const assets = {
	landingImage: "/assets/images/levelpics/village-01.small.webp",
	menuVideo: "/assets/graphics/menu.webm",
	menuMusic: "/assets/audio/music/group-1/anticipate.mid.m4a",
	heathenLogo: "/assets/graphics/heathen-logo/heathen-logo-red.webp",
	benevLogo: "/assets/graphics/benevolent.svg",
	levelpics: {
		village: levelImage("/assets/images/levelpics/village-03.webp"),
		gym: levelImage("/assets/images/levelpics/gym-01.webp"),
	},
}

function levelImage(big: string) {
	return {
		big,
		small: url_replace_extension(big, ".small.webp"),
	}
}

