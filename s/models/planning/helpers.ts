
import {Plan} from "./types.js"
import {scalar} from "@benev/toolbox"

export function game<G extends Plan.Game>(gameplan: G) {
	return gameplan
}

export function glb(path: string, physics?: "physics" | undefined): Plan.Glb {
	return {path, physics: !!physics}
}

export function env(path: string, rotation: number): Plan.Env {
	return {path, rotation}
}

export function sky(directory: string, extension: string, size: number, rotation: number): Plan.Sky {
	return {
		size,
		rotation,
		images: {
			px: `${directory}/px${extension}`,
			py: `${directory}/py${extension}`,
			pz: `${directory}/pz${extension}`,
			nx: `${directory}/nx${extension}`,
			ny: `${directory}/ny${extension}`,
			nz: `${directory}/nz${extension}`,
		},
	}
}

export function shader<Inputs extends object>(path: string, inputs: Inputs): Plan.Shader<Inputs> {
	return {path, inputs}
}

export function character(path: string): Plan.Character {
	return {glb: glb(path)}
}

export function levels<LevelName extends string>(levels: Record<LevelName, Plan.Level>) {
	return {
		cycle: (...levelCycle: LevelName[]) => ({
			levels,
			levelCycle,
		})
	}
}

export function kilometers(m: number) { return m * 1000 }
export const degrees = scalar.radians.from.degrees

