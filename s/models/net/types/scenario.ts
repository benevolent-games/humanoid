
import {Op} from "@benev/slate"
import {Lobby} from "./stats.js"

export type Local = {
	mode: "local"
} & Base

export type Host = {
	mode: "host"
	lobbyOp: Op.For<Lobby>
} & Base

export type Client = {
	mode: "client"
	lobbyOp: Op.For<Lobby>
} & Base

//////////////////////

export type Mode = "local" | "host" | "client"
export type Any = Local | Host | Client
export type Base = { mode: Mode }

