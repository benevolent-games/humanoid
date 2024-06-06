
export async function loadAudio(src: string) {
	return await new Promise<HTMLAudioElement>((resolve, reject) => {
		const audio = document.createElement("audio")
		audio.preload = "auto"
		audio.src = src
		audio.autoplay = true
		audio.loop = true
		audio.oncanplaythrough = () => resolve(audio)
		audio.onerror = reject
		audio.load()
	})
}

