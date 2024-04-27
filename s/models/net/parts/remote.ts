
export type RemoteRequest = [string, ...any[]]

export function remoteSender<Api extends object>(
		send: (data: string) => void
	) {
	return new Proxy({}, {
		get: (_, key: string) => (...args: any[]) => {
			const request: RemoteRequest = [key, ...args]
			const json = JSON.stringify(request)
			send(json)
		},
	}) as Api
}

export function remoteReceiver<Api extends object>(api: Api) {
	return (message: string) => {
		const [key, ...args] = JSON.parse(message)
		;(api as any)[key](...args)
	}
}

