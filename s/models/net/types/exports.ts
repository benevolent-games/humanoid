
import {LocalHandler} from "../handlers/local.js"
import {HostHandler} from "../handlers/host.js"
import {ClientHandler} from "../handlers/client.js"

export * from "./stats.js"
export * as Scenario from "./scenario.js"

export type AnyHandler = LocalHandler | HostHandler | ClientHandler

