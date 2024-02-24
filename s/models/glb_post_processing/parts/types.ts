
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

export type GlbPostProcess = (asset: AssetContainer) => Promise<AssetContainer>

