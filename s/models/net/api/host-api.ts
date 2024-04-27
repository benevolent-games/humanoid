
import {PingStation} from "../parts/ping-station.js"

export type HostApi = ReturnType<typeof makeHostApi>

export function makeHostApi({pingStation}: {
		pingStation: PingStation
	}) {
	return {
		pong(id: string) {
			pingStation.pong(id)
		},
	}
}

