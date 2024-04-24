
import {levelScript} from "../types.js"
import setup_fog from "../sfx/setup_fog.js"
import setup_shadows from "../sfx/setup_shadows.js"

export default levelScript(async(realm, stuff) => {
	const {bestorage} = realm
	const {quality} = realm.gameplan

	const shadows = setup_shadows(realm, stuff)

	const fog = setup_fog({
		stage: realm.stage,
		url: realm.gameplan.graphics.fog,
		particles: {
			fadeRange: 20,
			sizes: [10, 20],
			...(quality === "potato"
				? {count: 500, alpha: 25 / 100, spinrate: .5}
				: {count: 2000, alpha: 10 / 100, spinrate: .5}
			),
		},
	})

	if (quality === "potato") bestorage.json = `
		{"resolution":50,"effects":{"image":{"contrast":1.85,"exposure":1},"tonemapping":{"operator":"Photographic"},"vignette":{"color":[0,0,0],"weight":3.68,"stretch":1,"multiply":true},"scene":{"clearColor":[0.1,0.1,0.1],"ambientColor":[0,0,0],"shadowsEnabled":false,"environmentIntensity":0.38,"forceWireframe":false,"forceShowBoundingBoxes":false,"disableGammaTransform":false}},"shadows":{"basics":{"filter":0,"filteringQuality":2,"sunDistance":100,"grass_receives_shadows":true,"grass_casts_shadows":false},"light":{"intensity":7.6,"autoUpdateExtends":false,"autoCalcShadowZBounds":false,"shadowOrthoScale":0.1,"shadowFrustumSize":0,"shadowMinZ":10,"shadowMaxZ":500},"generator":{"enableSoftTransparentShadow":false,"useKernelBlur":false,"forceBackFacesOnly":false,"mapSize":1024,"blurScale":2,"blurKernel":1,"blurBoxOffset":1,"bias":0.00005,"darkness":0,"depthScale":50,"frustumEdgeFalloff":0},"cascaded":{"enabled":false,"debug":false,"stabilizeCascades":false,"autoCalcDepthBounds":true,"freezeShadowCastersBoundingInfo":true,"numCascades":4,"lambda":0.5,"cascadeBlendPercentage":0.05,"penumbraDarkness":1,"shadowMinZ":0.1,"shadowMaxZ":500}}}
	`
	else if (quality === "mid") bestorage.json = `
		{"resolution":100,"effects":{"image":{"contrast":1.82,"exposure":1},"tonemapping":{"operator":"Photographic"},"vignette":{"color":[0,0,0],"weight":3.69,"stretch":1,"multiply":true},"antialiasing":{"samples":8,"fxaa":true},"bloom":{"weight":0.1,"scale":0.57,"kernel":216,"threshold":0.797},"scene":{"clearColor":[0.1,0.1,0.1],"ambientColor":[0,0,0],"shadowsEnabled":true,"environmentIntensity":0.39,"forceWireframe":false,"forceShowBoundingBoxes":false,"disableGammaTransform":false}},"shadows":{"basics":{"filter":6,"filteringQuality":0,"sunDistance":100,"grass_receives_shadows":true,"grass_casts_shadows":true},"light":{"intensity":7.6,"autoUpdateExtends":false,"autoCalcShadowZBounds":false,"shadowOrthoScale":0.122,"shadowFrustumSize":0,"shadowMinZ":20,"shadowMaxZ":1000},"generator":{"enableSoftTransparentShadow":false,"useKernelBlur":false,"forceBackFacesOnly":false,"mapSize":2048,"blurScale":0,"blurKernel":0,"blurBoxOffset":0,"bias":0.000245,"darkness":0,"depthScale":0,"frustumEdgeFalloff":0},"cascaded":{"enabled":false,"debug":false,"stabilizeCascades":false,"autoCalcDepthBounds":true,"freezeShadowCastersBoundingInfo":true,"numCascades":4,"lambda":1,"cascadeBlendPercentage":0,"penumbraDarkness":0,"shadowMinZ":0,"shadowMaxZ":185}}}
	`
	else bestorage.json = `
		{"resolution":100,"effects":{"image":{"contrast":1.82,"exposure":1},"tonemapping":{"operator":"Photographic"},"vignette":{"color":[0,0,0],"weight":3.69,"stretch":1,"multiply":true},"antialiasing":{"samples":8,"fxaa":true},"bloom":{"weight":0.1,"scale":0.57,"kernel":216,"threshold":0.797},"scene":{"clearColor":[0.1,0.1,0.1],"ambientColor":[0,0,0],"shadowsEnabled":true,"environmentIntensity":0.39,"forceWireframe":false,"forceShowBoundingBoxes":false,"disableGammaTransform":false},"ssao":{"ssaoRatio":0.84,"blurRatio":0.73,"base":0.71,"bilateralSamples":8,"bilateralSoften":0,"bilateralTolerance":0,"maxZ":20,"minZAspect":0.5,"radius":3.81,"totalStrength":2.04,"bypassBlur":false,"epsilon":0.011,"expensiveBlur":true,"samples":16}},"shadows":{"basics":{"filter":7,"filteringQuality":0,"sunDistance":100,"grass_receives_shadows":true,"grass_casts_shadows":true},"light":{"intensity":7.6,"autoUpdateExtends":false,"autoCalcShadowZBounds":false,"shadowOrthoScale":0.122,"shadowFrustumSize":0,"shadowMinZ":20,"shadowMaxZ":1000},"generator":{"enableSoftTransparentShadow":false,"useKernelBlur":false,"forceBackFacesOnly":false,"mapSize":4096,"blurScale":1.71,"blurKernel":1.69,"blurBoxOffset":0.94,"contactHardeningLightSizeUVRatio":0.438,"bias":0.000245,"darkness":0,"depthScale":49.5,"frustumEdgeFalloff":0},"cascaded":{"enabled":true,"debug":false,"stabilizeCascades":false,"autoCalcDepthBounds":false,"freezeShadowCastersBoundingInfo":false,"numCascades":4,"lambda":0.83,"cascadeBlendPercentage":0,"penumbraDarkness":0,"shadowMinZ":5,"shadowMaxZ":80}}}
	`

	return {dispose: () => {
		shadows.dispose()
		fog.dispose()
	}}
})

