
import {Pojo} from "@benev/slate"

export namespace Plan {
	export type Assets = {
		root: string
		levels: Pojo<Level>
		levelCycle: string[]
		shaders: Pojo<Shader<any>>
	}

	export type Level = {
		glb: Glb
		env: Env
		sky: Sky
	}

	export type Glb = {
		path: string
	}

	export type Env = {
		path: string
		rotation: number
	}

	export type Sky = {
		size: number
		rotation: number
		images: {
			px: string
			py: string
			pz: string
			nx: string
			ny: string
			nz: string
		}
	}

	export type Shader<Inputs extends object> = {
		path: string
		inputs: Inputs
	}
}

