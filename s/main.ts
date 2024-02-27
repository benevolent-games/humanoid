
console.log("🏃 humanoid starting up")

import startup_web_components from "./startup/startup_web_components.js"
import startup_realm from "./startup/startup_realm.js"
import startup_ecs from "./startup/startup_ecs.js"
import startup_gameplay from "./startup/startup_gameplay.js"
import startup_gameloop from "./startup/startup_gameloop.js"

startup_web_components()
const realm = await startup_realm()
const ecs = startup_ecs(realm)
startup_gameplay(realm, ecs.world)
startup_gameloop(realm, ecs.executive)

console.log("🏃 humanoid up and running")

