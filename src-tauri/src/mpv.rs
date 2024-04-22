use crate::misc::extract_episode_number;
use sqlx::{Connection, SqliteConnection};
use std::fs;
use std::path::Path;
use std::process::Command;
use std::time::Duration;
use tauri::{Manager, Window};
use window_titles::{Connection as win_titles_Connection, ConnectionTrait};

#[tauri::command]
pub async fn open_video(
    path: String,
    handle: tauri::AppHandle,
    auto_play: String,
    user_id: u32,
) -> String {
    let window: Window = handle
        .clone()
        .get_window("main")
        .or_else(|| handle.clone().get_window("main"))
        .expect("failed to get any windows!");

    window.close().expect("failed to close main window");

    // Kill all mpv.exe processes before opening a new video.
    let mut sys = sysinfo::System::new_all();
    sys.refresh_processes(); // Refresh the list of processes.
    sys.processes().iter().for_each(|(_pid, process)| {
        if process.name().to_lowercase().contains("mpv.exe") {
            process.kill();
        }
    });

    println!("now playing {}", path);
    if auto_play == "On" {
        let parent_path = Path::new(&path).parent().unwrap().to_str().unwrap();
        let current_video_index = find_video_index(parent_path, &path);

        let _status = Command::new("mpv.exe")
            // --playlist-start should be the index of the video in the parent folder
            .arg(format!("--playlist-start={}", current_video_index))
            // --playlist should be the path of the parent folder
            .arg(format!("--playlist={}", parent_path))
            //.arg(format!("--title={} - mpv.exe", current_video_name))
            .arg("--title=${filename} - mpv.exe")
            .spawn()
            .unwrap();
    } else {
        match open::that(path.clone()) {
            Ok(_) => "Video opened successfully",
            Err(_) => "Failed to open video",
        };
    }

    let instant = std::time::Instant::now();
    let mut last_watched_video = String::new();

    loop {
        let mut mpv_running = false; // Flag to check if mpv is running.
        sys.refresh_processes();

        sys.processes().iter().for_each(|(_pid, process)| {
            if process.name().to_lowercase().contains("mpv.exe") {
                last_watched_video = get_last_mpv_win_title();
                mpv_running = true;
            }
        });

        if !mpv_running {
            println!(
                "mpv-shelf was running for {:.2} seconds in the background",
                &instant.elapsed().as_secs_f32()
            );

            // open a new window and close the first exe (not a window anymore) in the system tray
            open_new_window(handle.clone());
            update_last_watched_videos(handle, path.clone(), last_watched_video, user_id).await;

            return "closed".to_string();
        }

        tokio::time::sleep(Duration::from_secs(1)).await;
    }
}

fn open_new_window(handle: tauri::AppHandle) {
    match handle.get_window("main") {
        Some(window) => {
            window.center().unwrap();
            window.show().unwrap();
            window.set_focus().unwrap();
        }
        None => {
            tauri::WindowBuilder::new(
                &handle,
                "main".to_string(),
                tauri::WindowUrl::App("/dashboard".into()),
            )
            .center()
            .transparent(true)
            .title("mpv-shelf")
            .inner_size(800.0, 600.0)
            .build()
            .unwrap();
        }
    }
}

fn find_video_index(parent_path: &str, selected_video_path: &str) -> u32 {
    let mut video_files_vec: Vec<fs::DirEntry> = fs::read_dir(parent_path)
        .unwrap()
        .filter_map(|entry| entry.ok())
        // .filter(|entry| {
        //     let entry_path = entry.path();
        //     let ext = entry_path.extension().unwrap().to_str().unwrap();
        //     ext != "srt" && ext != "ass"
        // })
        .collect();

    video_files_vec.sort_by(|a, b| {
        let a = a.path();
        let b = b.path();
        let a_str = a.file_name().unwrap().to_string_lossy();
        let b_str = b.file_name().unwrap().to_string_lossy();

        let a_num: i32 = a_str
            .chars()
            .filter(|c| c.is_ascii_digit())
            .collect::<String>()
            .parse()
            .unwrap_or(0);
        let b_num: i32 = b_str
            .chars()
            .filter(|c| c.is_ascii_digit())
            .collect::<String>()
            .parse()
            .unwrap_or(0);

        a_num.cmp(&b_num)
    });

    // video_files_vec.iter().for_each(|file| {
    //     println!("{}", file.file_name().to_str().unwrap());
    // });

    let current_video_index = video_files_vec
        .iter()
        .position(|file| file.path().to_str().unwrap() == selected_video_path)
        .unwrap() as u32;

    //println!("{}", current_video_index);
    current_video_index
}

fn get_last_mpv_win_title() -> String {
    let connection = win_titles_Connection::new().unwrap();
    let mut current_episode = String::new();

    connection
        .window_titles()
        .unwrap()
        .iter()
        .for_each(|window| {
            if window.contains("mpv")
                && window.contains('.')
                && !window.contains('\\')
                && !window.contains("Visual Studio")
            {
                //println!("{}", window);
                current_episode = window.to_string();
            }
        });

    current_episode
}

async fn update_last_watched_videos(
    handle: tauri::AppHandle,
    video_start_path: String,
    last_video_watched_title: String,
    user_id: u32,
) {
    let video_start_title = Path::new(&video_start_path)
        .file_name()
        .unwrap()
        .to_str()
        .unwrap();

    //println!("last video watched: {}", last_video_watched_title);
    let video_start_episode_num: u32 = extract_episode_number(video_start_title).unwrap_or(0);
    let last_video_episode_num: u32 =
        extract_episode_number(&last_video_watched_title).unwrap_or(0);
    let mut sum: u32 = 0;

    if video_start_episode_num == 0 && last_video_episode_num == 0 {
        return;
    }

    if video_start_episode_num != last_video_episode_num
        && last_video_episode_num > video_start_episode_num
    {
        sum = last_video_episode_num - video_start_episode_num;
    }

    let db_url = handle
        .path_resolver()
        .app_data_dir()
        .unwrap()
        .join("main.db");

    let mut conn = SqliteConnection::connect(db_url.to_str().unwrap())
        .await
        .unwrap();

    for x in 1..=sum {
        let video_index = x + video_start_episode_num;
        let parts: Vec<&str> = video_start_path
            .rsplitn(2, &video_start_episode_num.to_string())
            .collect();
        let starting_new_path = if parts.len() == 2 {
            parts[1].to_owned() + &video_index.to_string() + parts[0]
        } else {
            video_start_path.clone()
        };

        sqlx::query(
            "INSERT OR REPLACE INTO video (path, userId, watched, lastWatchedAt) VALUES (?, ?, ?, datetime('now'))",
        )
        .bind(starting_new_path)
        .bind(user_id)
        .bind(true)
        .execute(&mut conn)
        .await
        .unwrap();
    }

    conn.close().await.unwrap();
}
