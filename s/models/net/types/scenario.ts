
import {ClientState, HostState, Session, SessionInfo} from "sparrow-rtc"

export type Local = {
	mode: "local"
}

export type Host = {
	mode: "host"
	state: HostState
	lobby: Lobby
}

export type Client = {
	mode: "client"
	state: ClientState
	lobby: Lobby
}

//////////////////////

export type Any = Local | Host | Client

//////////////////////

export type Lobby = {
	players: Player[]
}

export type Player = {
	clientId: string
	ping: number
}

