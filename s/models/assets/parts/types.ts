
import {Pojo} from "@benev/slate"

export type AssetLinks = {
	root: string
	glbs: {
		levels: Pojo<string>
		characters: Pojo<string>
	}
	envmaps: Pojo<string>
	skyboxes: Pojo<{
		directory: string
		extension: string
	}>
	shaders: Pojo<{
		path: string
		inputs: Pojo<any>
	}>
}

