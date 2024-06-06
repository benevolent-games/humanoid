
export async function loadVideo(src: string) {
	return await new Promise<HTMLVideoElement>((resolve, reject) => {
		const video = document.createElement("video")
		video.preload = "auto"
		video.src = src
		video.autoplay = true
		video.loop = true
		video.oncanplaythrough = () => resolve(video)
		video.onerror = reject
		video.load()
	})
}

