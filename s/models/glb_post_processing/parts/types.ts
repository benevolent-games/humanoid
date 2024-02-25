
import {Plan} from "../../planning/types.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

export type GlbPostProcess = (asset: AssetContainer, glb: Plan.Glb) => Promise<AssetContainer>

