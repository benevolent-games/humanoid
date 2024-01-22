
import {Ecs3} from "@benev/toolbox"
import {Realm} from "../models/realm/realm.js"
import {HumanoidSchema, HumanoidTick} from "./schema.js"

export const hub = new Ecs3.Hub<
	Realm,
	HumanoidTick,
	HumanoidSchema
>()

