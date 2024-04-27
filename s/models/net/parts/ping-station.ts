
import {generate_id, signal} from "@benev/slate"

export class Ping {
	readonly id = generate_id(8)
	readonly created = Date.now()
	get elapsed() { return Date.now() - this.created }
}

export class PingStation {
	#limit = 10
	#pings: Ping[] = []
	#rtt = signal(-1)
	#onReport: (rtt: number) => void

	constructor({onReport}: {
			onReport: (rtt: number) => void
		}) {
		this.#onReport = onReport
	}

	get rtt() {
		return this.#rtt.value
	}

	ping() {
		const ping = new Ping()
		this.#pings.push(ping)

		while (this.#pings.length > this.#limit)
			this.#pings.shift()

		return ping
	}

	pong(id: string) {
		const otherPings: Ping[] = []
		let recovered: Ping | undefined

		for (const ping of this.#pings) {
			if (ping.id === id) recovered = ping
			else otherPings.push(ping)
		}

		this.#pings = otherPings

		if (recovered) {
			const rtt = recovered.elapsed
			this.#rtt.value = rtt
			this.#onReport(rtt)
		}
	}
}

