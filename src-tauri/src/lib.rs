// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::net::TcpStream;
use std::collections::HashMap;
use sysinfo::{
    Components,Disks,Networks,System,
};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You're the best developer in the country", name)
}

#[tauri::command]
fn get_stats() -> (bool,HashMap<String,String>) {
    let mut sys = System::new_all();
    sys.refresh_all(); 
    let mut stats: HashMap<String, String> = HashMap::new();

    let mut is_connected = false;

    if let Ok(stream) = TcpStream::connect("209.85.233.101:80") {
        is_connected = true;
    } else {
        is_connected = false;
    }

    stats.insert("CPU".to_string(),sys.cpus().len().to_string());
    stats.insert("RAM".to_string(),sys.used_memory().to_string());

    (is_connected,stats)
    
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_stats])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
