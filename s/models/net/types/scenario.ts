
import {Session, SessionInfo} from "sparrow-rtc"

export type Local = {
	mode: "local"
}

export type Host = {
	mode: "host"
	session: Session
	lobby: Lobby
}

export type Client = {
	mode: "client"
	clientId: string
	sessionInfo: SessionInfo
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

