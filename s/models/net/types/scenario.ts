
import {Lobby} from "./stats.js"

export type Local = {
	mode: "local"
} & Base

export type Host = {
	mode: "host"
	lobby: Lobby
} & Base

export type Client = {
	mode: "client"
	lobby: Lobby
} & Base

//////////////////////

export type Mode = "local" | "host" | "client"
export type Any = Local | Host | Client
export type Base = { mode: Mode }

