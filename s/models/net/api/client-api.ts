
import {HostApi} from "./host-api.js"

export type ClientApi = ReturnType<typeof makeClientApi>

export function makeClientApi(params: {
		hostApi: HostApi
	}) {
	return {
		ping(id: string) {
			params.hostApi.pong(id)
		},
	}
}

