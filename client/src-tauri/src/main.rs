// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(windows)]
extern crate winapi;
#[cfg(windows)]
use std::ffi::OsStr;
#[cfg(windows)]
use std::iter::once;
#[cfg(windows)]
use std::os::windows::ffi::OsStrExt;
#[cfg(windows)]
use winapi::um::winuser::SystemParametersInfoW;
#[cfg(windows)]
use winapi::um::winuser::SPI_SETDESKWALLPAPER;

#[tauri::command]
fn open_folder(path: String) {
  #[cfg(target_os = "windows")]
  {
    std::process::Command::new("explorer")
        .arg(&path)
        .spawn()
        .unwrap();
  }

  #[cfg(target_os = "linux")]
  {
    std::process::Command::new("xdg-open")
        .arg(&path)
        .spawn()
        .unwrap();
  }

  #[cfg(target_os = "macos")]
  {
    std::process::Command::new("open")
        .arg(&path)
        .spawn()
        .unwrap();
  }
}

#[tauri::command]
fn set_wallpaper(path: String) {
  #[cfg(target_os = "windows")]
    {
      let path_wide: Vec<u16> = OsStr::new(&path).encode_wide().chain(once(0)).collect();
      unsafe {
        SystemParametersInfoW(SPI_SETDESKWALLPAPER, 0, path_wide.as_ptr() as *mut _, 0);
      }

    }

  #[cfg(target_os = "linux")]
  {
    let output = std::process::Command::new("sh")
        .arg("-c")
        .arg("echo $DESKTOP_SESSION")
        .output()
        .unwrap();

    let desktop_env = String::from_utf8_lossy(&output.stdout).trim().to_string();

    match desktop_env.as_str() {
      "gnome" => {
        std::process::Command::new("gsettings")
            .arg("set")
            .arg("org.gnome.desktop.background")
            .arg("picture-uri")
            .arg(format!("file://{}", path))
            .spawn()
            .unwrap();
      },
      "plasma" => {
        std::process::Command::new("qdbus")
            .arg("org.kde.plasmashell")
            .arg("/PlasmaShell")
            .arg("org.kde.PlasmaShell.evaluateScript")
            .arg(format!("var allDesktops = desktops();print (allDesktops);for (i=0;i<allDesktops.length;i++) {{d = allDesktops[i];d.wallpaperPlugin = \"org.kde.image\";d.currentConfigGroup = Array(\"Wallpaper\", \"org.kde.image\", \"General\");d.writeConfig(\"Image\", \"{}\")}}", path))
            .spawn()
            .unwrap();
      },
      "cinnamon" => {
        std::process::Command::new("gsettings")
            .arg("set")
            .arg("org.cinnamon.desktop.background")
            .arg("picture-uri")
            .arg(format!("file://{}", path))
            .spawn()
            .unwrap();
      },
      _ => {
        println!("Unsupported desktop environment");
      }
    }
  }

  #[cfg(target_os = "macos")]
  {
    std::process::Command::new("osascript")
        .arg("-e")
        .arg(format!("tell application \"Finder\" to set desktop picture to POSIX file \"{}\"", path))
        .spawn()
        .unwrap();
  }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_folder, set_wallpaper])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
