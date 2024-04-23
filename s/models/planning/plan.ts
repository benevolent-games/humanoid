
import {Pojo} from "@benev/slate"
import {PlanningHelpers} from "./helpers.js"
import {Quality} from "../../tools/quality.js"

export namespace Plan {
	export type Game = {
		root_url: string
		characters: Pojo<Character>
		levels: Pojo<Level>
		shaders: Pojo<Shader<any>>
		graphics: Pojo<string>
	}

	export type Character = {
		glb: Glb
	}

	export type Level = {
		glb: Glb
		env: Env
		sky: Sky
	}

	export type Glb = {
		url: string
		physics: boolean
	}

	export type Env = {
		url: string
		rotation: number
	}

	export type Sky = {
		size: number
		rotation: number
		height: number
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
		url: string
		inputs: Inputs
		forced_extension_for_textures: string
	}

	export type Situation = {
		local: boolean
		quality: Quality
		root_url: string
	}

	export const gameplan = (
		<G extends Game>(fn: ({}: Plan.Situation & PlanningHelpers) => G) =>
			(s: Plan.Situation) => fn({...s, ...new PlanningHelpers(s)})
	)
}

