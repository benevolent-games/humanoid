
import {HostApi} from "./host-api.js"

export type ClientApi = ReturnType<typeof makeClientApi>

export function makeClientApi({hostApi}: {
		hostApi: HostApi
	}) {
	return {
		ping(id: string) {
			hostApi.pong(id)
		},
	}
}

