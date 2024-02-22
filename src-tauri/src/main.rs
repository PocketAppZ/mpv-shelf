// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[allow(unused_imports)]
use random_color::color_dictionary::{ColorDictionary, ColorInformation};
#[allow(unused_imports)]
use random_color::{Color, Luminosity, RandomColor};
use serde::{Deserialize, Serialize};
use sqlx::{migrate::MigrateDatabase, Sqlite};
use std::process::Command;
use std::vec;
use sysinfo::System;
use tauri::{generate_handler, Manager};
#[allow(unused_imports)]
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

#[derive(Serialize, Deserialize)]
struct User {
    id: i64,
    pin: Option<String>,
}

fn main() {
    let open = CustomMenuItem::new("open".to_string(), "Open");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");

    let tray_menu = SystemTrayMenu::new()
        .add_item(open)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    let tray = SystemTray::new().with_menu(tray_menu).clone();

    fn hack_builder(tray: SystemTray) {
        tauri::Builder::default()
            .system_tray(tray.clone())
            .on_system_tray_event(move |app, event| match event {
                SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                    "open" => {
                        match app.get_window("main") {
                            Some(window) => {
                                window.show().unwrap();
                                window.set_focus().unwrap();
                            }
                            None => {
                                hack_builder(tray.clone());
                                std::process::exit(0);
                                // Trigger the hack builder again
                            }
                        }
                    }
                    "hide" => {
                        let window = app.get_window("main").unwrap();
                        window.hide().unwrap();
                    }
                    "quit" => {
                        let db_url: String = app
                            .path_resolver()
                            .app_data_dir()
                            .expect("failed to get app data dir")
                            .as_path()
                            .to_str()
                            .unwrap()
                            .to_string()
                            + "\\main.db";

                        tauri::async_runtime::spawn(async move {
                            if Sqlite::database_exists(&db_url).await.unwrap_or(false) {
                                println!("Database exists, dropping");
                                Sqlite::drop_database(&db_url).await.unwrap();
                            } else {
                                println!("YOU DONE FUCKED UP. SHIT AINT WORKIN NIGGA");
                            }
                        });

                        std::process::exit(0);
                    }
                    _ => {}
                },
                _ => {}
            })
            .plugin(tauri_plugin_sql::Builder::default().build())
            .invoke_handler(generate_handler![
                open_video,
                show_in_folder,
                generate_random_color
            ])
            .build(tauri::generate_context!())
            .expect("error while building tauri application")
            .run(|_app_handle, event| match event {
                tauri::RunEvent::ExitRequested { api, .. } => {
                    api.prevent_exit();
                }
                _ => {}
            });
    }

    hack_builder(tray);
}

#[tauri::command]
async fn open_video(path: String, handle: tauri::AppHandle) -> String {
    // Please note that we use "new_all" to ensure that all list of
    // components, network interfaces, disks and users are already
    // filled!
    let mut sys = System::new_all();

    // First we update all information of our `System` struct.
    sys.refresh_all();

    //hide the main window, causing the app to minimize to the system tray
    let window = handle.clone().get_window("main").expect("no main window");

    window.hide().expect("failed to close main window");

    #[allow(unused_variables)]
    for (pid, process) in sys.processes() {
        if process.name().to_lowercase().contains("mpv.exe") {
            process.kill();
        }
    }

    match open::that(path) {
        Ok(_) => "Video opened successfully",
        Err(_) => "Failed to open video",
    };

    let instant = std::time::Instant::now();

    // Loop indefinitely until mpv.exe is not found.
    loop {
        print!("\r{:.2}", &instant.elapsed().as_secs_f32());
        sys.refresh_processes(); // Refresh the list of processes.

        let mut mpv_running = false; // Flag to check if mpv is running.

        // Check all processes to see if mpv.exe is running.
        for (_pid, process) in sys.processes() {
            if process.name().to_lowercase() == "mpv.exe" {
                mpv_running = true; // mpv is still running.
                break; // No need to check further processes.
            }
        }

        if !mpv_running {
            window.show().expect("failed to show main window");
            println!(
                "mpv-shelf was running for {:.2} seconds in the background",
                &instant.elapsed().as_secs_f32()
            );
            return "closed".to_string();
        }

        // Sleep for a bit before checking again to reduce CPU usage.
        std::thread::sleep(std::time::Duration::from_secs(1));
    }
}

#[tauri::command]
fn show_in_folder(path: String) {
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .args(["/select,", &path]) // The comma after select is not a typo
            .spawn()
            .unwrap();
    }

    #[cfg(target_os = "linux")]
    {
        if path.contains(",") {
            // see https://gitlab.freedesktop.org/dbus/dbus/-/issues/76
            let new_path = match metadata(&path).unwrap().is_dir() {
                true => path,
                false => {
                    let mut path2 = PathBuf::from(path);
                    path2.pop();
                    path2.into_os_string().into_string().unwrap()
                }
            };
            Command::new("xdg-open").arg(&new_path).spawn().unwrap();
        } else {
            if let Ok(Fork::Child) = daemon(false, false) {
                Command::new("dbus-send")
                    .args([
                        "--session",
                        "--dest=org.freedesktop.FileManager1",
                        "--type=method_call",
                        "/org/freedesktop/FileManager1",
                        "org.freedesktop.FileManager1.ShowItems",
                        format!("array:string:\"file://{path}\"").as_str(),
                        "string:\"\"",
                    ])
                    .spawn()
                    .unwrap();
            }
        }
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open").args(["-R", &path]).spawn().unwrap();
    }
}

#[tauri::command]
fn generate_random_color() -> String {
    let color = RandomColor::new()
        .luminosity(Luminosity::Light) // Ensuring the color is light, for a pastel-like effect
        .alpha(0.2)
        .to_hex()
        .to_string(); // Output as an HSL string for finer control over the appearance

    color
}
