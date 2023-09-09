#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use active_win_pos_rs::get_active_window;

#[tauri::command]
fn get_frontmost_window() -> String {
    match get_active_window() {
        Ok(active_window) => {
            format!("{{\"title\": \"{}\", \"process_name\": \"{}\", \"process_id\": \"{}\", \"window_id\": \"{}\"}}", active_window.title, active_window.app_name, active_window.process_id, active_window.window_id)
        }
        Err(()) => {
            format!("{{\"error\": \"{}\"}}", "Error getting active window")
        }
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![get_frontmost_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
