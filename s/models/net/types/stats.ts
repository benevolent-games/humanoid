
import {Session} from "sparrow-rtc"

export type Lobby = {
	session: Session
	players: Player[]
}

export type Player = {
	id: string
	ping: number
}

