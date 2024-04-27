
import {LocalHandler} from "../handlers/local-handler.js"
import {HostHandler} from "../handlers/host-handler.js"
import {ClientHandler} from "../handlers/client-handler.js"

export * as Scenario from "./scenario.js"

export type AnyHandler = LocalHandler | HostHandler | ClientHandler

