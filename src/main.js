

const { invoke } = window.__TAURI__.core;

let valu
let connection_status_dot
let refresh_btn

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
}

async function get_stats() {

  let is_connected = await invoke("get_stats", {});
  connection_status_dot.style.cssText = is_connected ? `background-color:green` : `background-color:red`
  valu.textContent = is_connected ? "Online" : "Offline"
}



window.addEventListener("DOMContentLoaded", () => {
  valu = document.getElementById("valu")
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
