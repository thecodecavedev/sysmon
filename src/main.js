

const { invoke } = window.__TAURI__.core;

let valu
let connection_status_dot
let refresh_btn
let ram_val
let cpu_val

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
}

async function get_stats() {

  let stats = await invoke("get_stats", {})

  let is_connected = stats[0];
  let ram = stats[1]["RAM"]
  let cpu = stats[1]["CPU"]
  console.log(await invoke("get_stats", {})[0])
  connection_status_dot.style.cssText = is_connected ? `background-color:green` : `background-color:red`
  valu.textContent = is_connected ? "Online" : "Offline"
  ram_val.textContent = parseInt(ram)/1000000+" MB"
  cpu_val.textContent = cpu
  
}



window.addEventListener("DOMContentLoaded", () => {
  valu = document.getElementById("valu")
  ram_val = document.querySelector(".ram")
  cpu_val = document.querySelector(".cpu")
  let btn = document.getElementById("btn")
  connection_status_dot = document.querySelector(".dot")
  refresh_btn = document.querySelector(".refresh")
  get_stats()

  refresh_btn.addEventListener("click", (e) => {
    get_stats()
  })

  setTimeout(() => {
    console.log(valu)
  }, 2000
  )

});
