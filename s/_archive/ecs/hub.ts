
import {Ecs4} from "@benev/toolbox"
import {HumanoidRealm} from "../models/realm/realm.js"
import {HumanoidSchema, HumanoidTick} from "./schema.js"

export const hub = new Ecs4.Hub<HumanoidRealm, HumanoidTick, HumanoidSchema>()
export const {system, behavior, kinds} = hub

