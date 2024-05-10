
import {ColorInput, InputGroup} from "./types.js"
import {NuiCheckbox, NuiColor, NuiRange, vec3} from "@benev/toolbox"

export function renderInputGroup<Data extends Record<string, any>>(data: Data, group: InputGroup<Data>) {
	return Object.entries(group).map(([key, spec]) => {
		const [kind] = spec
		const value = data[key] as any
		const set = (x: any) => (data as any)[key] = x

		if (kind === Boolean) {
			return NuiCheckbox([{
				label: key,
				checked: value,
				set: x => (data as any)[key] = x,
			}])
		}

		else if (kind === Number) {
			const granularity = spec[1]!
			return NuiRange([{
				...granularity,
				label: key,
				value,
				set,
			}])
		}

		else if (kind === ColorInput) {
			return NuiColor([{
				label: key,
				set: ({color}) => set(color),
				initial_hex_color: vec3.to.hexcolor(value),
			}])
		}

		else throw new Error("unknown group kind")
	})
}

