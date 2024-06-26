
import {Plan} from "./plan.js"
import {Quality, normalizeQualityString} from "../../tools/quality.js"

const compressed_image_extension = ".webp"

export class PlanningHelpers {
	root_url: string
	quality: Quality
	local: boolean

	constructor(s: Plan.Situation) {
		this.root_url = s.root_url
		this.quality = normalizeQualityString(s.quality)
		this.local = s.local
	}

	resolve = (path: string) => `${this.root_url}/${path}`

	qualitative = (url: string) => {
		const slashed = url.split("/")
		const filename = slashed.pop()!
		const dotted = filename.split(".")
		const extension = dotted.pop()!
		const name = dotted.join(".")
		return `${slashed.join("/")}/${name}.${this.quality}.${extension}`
	}

	glb = (path: string, physics?: "physics" | undefined): Plan.Glb => ({
		url: this.qualitative(this.resolve(path)),
		physics: !!physics,
	})

	env = (path: string, rotation: number): Plan.Env => ({
		url: this.resolve(path),
		rotation,
	})

	graphic = (path: string) => this.resolve(path)

	sky = (directory: string, size: number, rotation: number, height = 0): Plan.Sky => ({
		size,
		rotation,
		height,
		images: {
			px: `${this.resolve(directory)}/px${compressed_image_extension}`,
			py: `${this.resolve(directory)}/py${compressed_image_extension}`,
			pz: `${this.resolve(directory)}/pz${compressed_image_extension}`,
			nx: `${this.resolve(directory)}/nx${compressed_image_extension}`,
			ny: `${this.resolve(directory)}/ny${compressed_image_extension}`,
			nz: `${this.resolve(directory)}/nz${compressed_image_extension}`,
		},
	})

	shader = <Inputs extends object>(path: string, inputs: Inputs): Plan.Shader<Inputs> => ({
		url: this.resolve(path),
		inputs,
		forced_extension_for_textures: compressed_image_extension,
	})

	character = (path: string): Plan.Character => ({
		glb: this.glb(path),
	})

	level = (level: Plan.Level) => level
	levels = <LevelName extends string>(levels: Record<LevelName, Plan.Level>) => levels
}

