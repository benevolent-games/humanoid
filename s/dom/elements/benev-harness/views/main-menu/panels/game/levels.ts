
import {loadImage} from "../../../../utils/load-image.js"

export const levels = {
	village: "/assets/images/levelpics/village-03.small.webp",
	gym: "/assets/images/levelpics/gym-01.small.webp",
}

export type Levels = typeof levels
export type LevelName = keyof Levels
export type LevelImages = {[K in keyof Levels]: HTMLImageElement}

export async function loadLevelImages() {
	const promises = Object.entries(levels)
		.map(
			async([name, src]) => [
				name,
				await loadImage(src),
			] as [string, HTMLImageElement]
		)
	return (
		Object.fromEntries(await Promise.all(promises))
	) as LevelImages
}

