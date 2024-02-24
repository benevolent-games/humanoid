
import {deep} from "@benev/slate/x/pure.js"
import {Nametag, parse_nametag} from "./parse_nametag.js"
import {CynicBrokenExpectation, Suite, expect} from "cynic"

export default {

	"name": async() =>
		check("reno", {name: "reno", plain: "reno"}),

	"number": async() =>
		check("reno.001", {name: "reno.001", plain: "reno", rubbish: "001"}),

	"tag": async() =>
		check("reno::yuma", {name: "reno", tags: [["yuma"]]}),

	"tag with data": async() =>
		check("reno::lima=hilo", {name: "reno", tags: [["lima", "hilo"]]}),

	"tag with data that contains equal sign": async() =>
		check("reno::lima=hilo=cali", {name: "reno", tags: [["lima", "hilo=cali"]]}),

	"multiple tags": async() =>
		check("reno::yuma::oslo", {name: "reno", tags: [["yuma"], ["oslo"]]}),

	"lod": async() =>
		check("reno#2", {name: "reno", lod: 2}),

	"name/tags/lod/number": async() =>
		check("reno::lima=hilo::oslo#0.001", {
			name: "reno.001",
			plain: "reno",
			tags: [["lima", "hilo"], ["oslo"]],
			lod: 2,
			rubbish: "001",
		}),

	"scrambled name/number/tag/lod/tag": async() =>
		check("reno.001::lima=hilo#0::oslo", {
			name: "reno.001",
			plain: "reno",
			tags: [["lima", "hilo"], ["oslo"]],
			lod: 2,
			rubbish: "001",
		}),

	"throws errors": async() => {
		expect(() => parse_nametag("")).throws()
		expect(() => parse_nametag("::lima=hilo::oslo#0.001")).throws()
	},

} satisfies Suite

//////////////////////////////////////////

function check(nametag: string, expectation: Partial<Nametag>) {
	const x = parse_nametag(nametag) as any
	for (const [key, value] of Object.entries(expectation)) {
		if (typeof value === "string" && x[key] !== value)
			throw new CynicBrokenExpectation(`failed on "${key}", expected "${value}", but got "${x[key]}"`)
		else if (Array.isArray(value) && !deep.equal(x[key], value))
			throw new CynicBrokenExpectation(`failed on "${key}", expected array [${value.join(", ")}], but got [${x[key].join(", ")}]`)
	}
}

