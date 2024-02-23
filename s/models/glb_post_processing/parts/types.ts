
import {Scene} from "@babylonjs/core/scene.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

export type GlbPostProcess = (asset: AssetContainer, scene: Scene) => Promise<AssetContainer>

