
import {Pojo} from "@benev/slate"
import {HuLevel} from "../../../../../../../gameplan.js"
import {loadImage} from "../../../../utils/load-image.js"
import {Plan} from "../../../../../../../models/planning/plan.js"

export type LevelImages = {[K in HuLevel]: HTMLImageElement}

export async function loadLevelThumbnails(levels: Pojo<Plan.Level>) {
	const promises = Object.entries(levels)
		.map(async([name, {images}]) => [
			name,
			await loadImage(images.small),
		] as [string, HTMLImageElement])

	return (
		Object.fromEntries(await Promise.all(promises))
	) as LevelImages
}

