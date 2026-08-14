// import { listen } from "@tauri-apps/api/event"

const { invoke } = window.__TAURI__.core;
const { listen, emit } = window.__TAURI__.event;

let valu
let connection_status_dot
let refresh_btn
let ram_val
let cpu_val
let ram
let total_ram
let ram_progress_bar

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
}


function init() {
  listen("update_ram_stats", (e) => {
    ram_val.textContent = Number.parseFloat(parseInt(e.payload) / 1000000000).toFixed(2) + " GB"
    ram_progress_bar.value = (e.payload/total_ram)*100
  })

  console.log(ram_progress_bar)
}

async function get_stats() {

  let stats = await invoke("get_stats", {})

  let is_connected = stats[0];
  ram = stats[1]["RAM"]
  total_ram = stats[1]["TOTAL_RAM"]
  // console.log(await invoke("get_stats", {})[0])
  connection_status_dot.style.cssText = is_connected ? `background-color:green` : `background-color:red`
  valu.textContent = is_connected ? "Online" : "Offline"
  ram_val.textContent = Number.parseFloat(parseInt(ram) / 1000000000).toFixed(2) + " GB"
  // cpu_val.textContent = cpu

}



window.addEventListener("DOMContentLoaded", () => {
  valu = document.getElementById("valu")
  ram_val = document.querySelector(".ram")
  cpu_val = document.querySelector(".cpu")
  let btn = document.getElementById("btn")
  ram_progress_bar = document.getElementById("ram-prog")
  connection_status_dot = document.querySelector(".dot")
  refresh_btn = document.querySelector(".refresh")
  get_stats()
  init()

  refresh_btn.addEventListener("click", (e) => {
    get_stats()
  })


});

