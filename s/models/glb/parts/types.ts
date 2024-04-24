
import {Shader} from "./shader.js"
import {Plan} from "../../planning/plan.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

export type ShaderPostProcess = (shader: Shader) => Promise<void>
export type GlbPostProcess = (asset: AssetContainer, glb: Plan.Glb) => Promise<void>

