
import {HuRealm} from "../realm/realm.js"
import {LevelStuff} from "../../ecs/components/hybrids/level.js"

export type LevelScript = (realm: HuRealm, level: LevelStuff) => Promise<{dispose: () => void}>
export const levelScript = (script: LevelScript) => script

