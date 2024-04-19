
import type {Suite} from "cynic"

const g = global as any
g.HTMLElement = class {}

export default await async function() {
	return <Suite>{
		meleeReporting: (await import("./models/activity/reports/melee/melee-report.test.js")).default,
	}
}()

