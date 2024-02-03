
import {Ecs4} from "@benev/toolbox"
import {Realm} from "../models/realm/realm.js"
import {HumanoidSchema, HumanoidTick} from "./schema.js"

export const hub = new Ecs4.Hub<Realm, HumanoidTick, HumanoidSchema>()
export const {system, behavior, kinds} = hub

