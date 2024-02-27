
import {Plan} from "../../planning/plan.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

export type GlbPostProcess = (asset: AssetContainer, glb: Plan.Glb) => Promise<AssetContainer>

