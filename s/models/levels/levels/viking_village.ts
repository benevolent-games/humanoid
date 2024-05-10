
import {clone, debounce, reactor} from "@benev/slate"
import {DirectionalLight} from "@babylonjs/core/Lights/directionalLight.js"

import {Ui} from "../../ui/ui.js"
import {levelScript} from "../types.js"
import setup_fog from "../sfx/setup_fog.js"
import setup_shadows from "../sfx/setup_shadows.js"

export default levelScript(async(realm, stuff) => {
	const {bestorage} = realm
	const {quality} = realm.gameplan

	const sunlight = stuff.level.lights[0] as DirectionalLight

	const shadows = setup_shadows(realm, stuff, sunlight)

	let particleFog: ReturnType<typeof setup_fog> | null = null

	const applyFogSettings = debounce(100, (data: Ui["particleFog"]) => {
		if (particleFog)
			particleFog.dispose()

		particleFog = data.enabled ? setup_fog({
			stage: realm.stage,
			url: realm.gameplan.graphics.fog,
			extent: [[-40, -1, -50], [40, 12, 50]],
			particles: {
				fadeRange: 20,
				sizes: [10, 20],
				colors: [data.color1, data.color2],
				count: data.count,
				alpha: data.alpha,
				spinrate: data.spinrate,
			},
		}) : null
	})

	const stop1 = reactor.reaction(
		() => clone(realm.ui.particleFog),
		data => applyFogSettings(data),
	)

	const stop2 = realm.stage.rendering.onEffectsChange(
		() => applyFogSettings(clone(realm.ui.particleFog))
	)

	if (quality === "potato") bestorage.json = `
		{"resolution":50,"effects":{"image":{"contrast":1.85,"exposure":1},"tonemapping":{"operator":"Photographic"},"vignette":{"color":[0,0,0],"weight":3.68,"stretch":1,"multiply":true},"scene":{"clearColor":[0.1,0.1,0.1],"ambientColor":[0,0,0],"shadowsEnabled":false,"environmentIntensity":0.38,"forceWireframe":false,"forceShowBoundingBoxes":false,"disableGammaTransform":false}},"shadows":{"basics":{"filter":0,"filteringQuality":2,"sunDistance":100,"grass_receives_shadows":true,"grass_casts_shadows":false},"light":{"intensity":7.6,"autoUpdateExtends":false,"autoCalcShadowZBounds":false,"shadowOrthoScale":0.1,"shadowFrustumSize":0,"shadowMinZ":10,"shadowMaxZ":500},"generator":{"enableSoftTransparentShadow":false,"useKernelBlur":false,"forceBackFacesOnly":false,"mapSize":1024,"blurScale":2,"blurKernel":1,"blurBoxOffset":1,"contactHardeningLightSizeUVRatio":0.1,"bias":0.00005,"darkness":0,"depthScale":50,"frustumEdgeFalloff":0},"cascaded":{"enabled":false,"debug":false,"stabilizeCascades":false,"autoCalcDepthBounds":true,"freezeShadowCastersBoundingInfo":true,"numCascades":4,"lambda":0.5,"cascadeBlendPercentage":0.05,"penumbraDarkness":1,"shadowMinZ":0.1,"shadowMaxZ":500}},"particleFog":{"enabled":true,"color1":[0.7058823529411765,0.8156862745098039,0.9921568627450981],"color2":[0.4549019607843137,0.596078431372549,0.7058823529411765],"alpha":0.128,"count":500,"spinrate":0.39}}
	`
	else if (quality === "mid") bestorage.json = `
		{"resolution":100,"effects":{"image":{"contrast":1.82,"exposure":1},"tonemapping":{"operator":"Photographic"},"vignette":{"color":[0,0,0],"weight":3.11,"stretch":1,"multiply":true},"antialiasing":{"samples":8,"fxaa":true},"bloom":{"weight":0.48,"scale":0.57,"kernel":392,"threshold":0.178},"scene":{"clearColor":[0.1,0.1,0.1],"ambientColor":[0,0,0],"shadowsEnabled":true,"environmentIntensity":0.39,"forceWireframe":false,"forceShowBoundingBoxes":false,"disableGammaTransform":false}},"shadows":{"basics":{"filter":7,"filteringQuality":0,"sunDistance":100,"grass_receives_shadows":true,"grass_casts_shadows":false},"light":{"intensity":6.4,"autoUpdateExtends":false,"autoCalcShadowZBounds":false,"shadowOrthoScale":0.122,"shadowFrustumSize":0,"shadowMinZ":20,"shadowMaxZ":1000},"generator":{"enableSoftTransparentShadow":false,"useKernelBlur":false,"forceBackFacesOnly":false,"mapSize":2048,"blurScale":0,"blurKernel":0,"blurBoxOffset":0,"contactHardeningLightSizeUVRatio":0.38,"bias":0.00018,"darkness":0,"depthScale":0,"frustumEdgeFalloff":0},"cascaded":{"enabled":true,"debug":false,"stabilizeCascades":false,"autoCalcDepthBounds":false,"freezeShadowCastersBoundingInfo":true,"numCascades":4,"lambda":0.94,"cascadeBlendPercentage":0,"penumbraDarkness":0,"shadowMinZ":0,"shadowMaxZ":185}},"particleFog":{"enabled":true,"color1":[0.7058823529411765,0.8156862745098039,0.9921568627450981],"color2":[0.4549019607843137,0.596078431372549,0.7058823529411765],"alpha":0.031,"count":5000,"spinrate":1.28}}
	`
	else bestorage.json = `
		{"resolution":100,"effects":{"image":{"contrast":1.82,"exposure":1},"tonemapping":{"operator":"Photographic"},"vignette":{"color":[0,0,0],"weight":3.69,"stretch":1,"multiply":true},"antialiasing":{"samples":8,"fxaa":true},"bloom":{"weight":0.1,"scale":0.57,"kernel":216,"threshold":0.797},"scene":{"clearColor":[0.1,0.1,0.1],"ambientColor":[0,0,0],"shadowsEnabled":true,"environmentIntensity":0.39,"forceWireframe":false,"forceShowBoundingBoxes":false,"disableGammaTransform":false}},"shadows":{"basics":{"filter":7,"filteringQuality":0,"sunDistance":100,"grass_receives_shadows":true,"grass_casts_shadows":true},"light":{"intensity":7.6,"autoUpdateExtends":false,"autoCalcShadowZBounds":false,"shadowOrthoScale":0.116,"shadowFrustumSize":0,"shadowMinZ":0,"shadowMaxZ":210},"generator":{"enableSoftTransparentShadow":false,"useKernelBlur":false,"forceBackFacesOnly":true,"mapSize":4096,"blurScale":1.71,"blurKernel":1.69,"blurBoxOffset":0.94,"contactHardeningLightSizeUVRatio":1.17,"bias":0.000116,"darkness":0,"depthScale":47.1,"frustumEdgeFalloff":0},"cascaded":{"enabled":true,"debug":false,"stabilizeCascades":true,"autoCalcDepthBounds":false,"freezeShadowCastersBoundingInfo":false,"numCascades":4,"lambda":0.91,"cascadeBlendPercentage":0,"penumbraDarkness":0,"shadowMinZ":0,"shadowMaxZ":85}},"particleFog":{"enabled":true,"color1":[0.7058823529411765,0.8156862745098039,0.9921568627450981],"color2":[0.4549019607843137,0.596078431372549,0.7058823529411765],"alpha":0.031,"count":5000,"spinrate":1.28}}
	`

	return {dispose: () => {
		shadows.dispose()
		stop1()
		stop2()
		if (particleFog)
			particleFog.dispose()
	}}
})

