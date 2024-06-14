
import {assets} from "../../../../constants.js"
import {loadImage} from "../../../../utils/load-image.js"

export type Levels = typeof assets.levelpics
export type LevelName = keyof Levels
export type LevelImages = {[K in keyof Levels]: HTMLImageElement}

export async function loadLevelThumbnails() {
	const promises = Object.entries(assets.levelpics)
		.map(async([name, {small}]) => [
			name,
			await loadImage(small),
		] as [string, HTMLImageElement])

	return (
		Object.fromEntries(await Promise.all(promises))
	) as LevelImages
}

