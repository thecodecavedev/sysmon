// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::collections::HashMap;
use std::{net::TcpStream, time::Duration};
use sysinfo::System;
use tauri::{AppHandle, Emitter};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You're the best developer in the country", name)
}

#[tauri::command]
fn get_stats() -> (bool, HashMap<String, String>) {
    let mut sys = System::new_all();

    sys.refresh_all();
    let mut stats: HashMap<String, String> = HashMap::new();

    let is_connected;

    if let Ok(_stream) = TcpStream::connect("209.85.233.101:80") {
        is_connected = true;
    } else {
        is_connected = false;
    }

    stats.insert("TOTAL_RAM".to_string(), sys.total_memory().to_string());
    stats.insert("RAM".to_string(), sys.used_memory().to_string());

    (is_connected, stats)
}

// #[tauri::command]
fn update_ram_stats(app: AppHandle) {
    tauri::async_runtime::spawn(async move {
        let mut sys = System::new_all();
        loop {
            sys.refresh_memory();
            let ram_used: String = sys.used_memory().to_string();
            if let Err(e) = app.emit("update_ram_stats", ram_used) {
                eprintln!("failed to emit event: {:?}", e);
            }

            tokio::time::sleep(Duration::from_secs(2)).await;
        }
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            update_ram_stats(app.handle().clone());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, get_stats])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
