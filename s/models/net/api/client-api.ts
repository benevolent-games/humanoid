
import {HostApi} from "./host-api.js"
import {Lobby} from "../types/scenario.js"

export type ClientApi = ReturnType<typeof makeClientApi>

export function makeClientApi({hostApi, updateLobby}: {
		hostApi: HostApi
		updateLobby: (lobby: Lobby) => void
	}) {
	return {

		ping(id: string, lobby: Lobby) {
			hostApi.pong(id)
			updateLobby(lobby)
		},
	}
}

