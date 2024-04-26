
import * as renraku from "renraku"
import { Lobby } from "./types/stats"

const expose = renraku.service().policy(async() => {}).expose

export type HostApi = ReturnType<typeof makeHostApi>
export type ClientApi = ReturnType<typeof makeClientApi>

export const makeHostApi = () => renraku.api({
	lobby: expose(() => ({
		async pong(id: string) {
			// do a thing
		},
	})),
})

export const makeClientApi = () => renraku.api({
	lobby: expose(() => ({
		async ping(id: string, lobby: Lobby) {
			// do a thing
		},
	})),
})

// const hostApi = makeHostApi()
// const hostServelet = renraku.servelet(hostApi)
// const lol = renraku.remote<HostApi>(
// 	hostServelet,
// 	{lobby: async() => {}},
// )

