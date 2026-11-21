use tauri::Manager;

pub use ics_gantt_core::{model, service, store};

fn service(app: &tauri::AppHandle) -> Result<service::CalendarService, String> {
    let app_data_root = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;
    Ok(service::CalendarService::from_app_data_root(&app_data_root))
}

fn data_directory(app: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
    app.path()
        .app_data_dir()
        .map(|path| path.join(service::DATA_DIR_NAME))
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn reset_store(app: tauri::AppHandle) -> Result<(), String> {
    service(&app)?.reset().map_err(|error| error.to_string())
}

#[tauri::command]
fn list_calendars(app: tauri::AppHandle) -> Result<Vec<model::CalendarType>, String> {
    service(&app)?
        .calendars()
        .map_err(|error| error.to_string())
}

#[tauri::command]
async fn add_calendar(
    app: tauri::AppHandle,
    calendar: model::CalendarType,
) -> Result<Vec<model::CalendarType>, String> {
    service(&app)?
        .add_calendar(calendar)
        .await
        .map_err(|error| error.to_string())
}

#[tauri::command]
async fn sync_calendar(app: tauri::AppHandle, id: String) -> Result<Vec<u8>, String> {
    service(&app)?
        .sync_calendar(id)
        .await
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn update_calendar(
    app: tauri::AppHandle,
    id: String,
    calendar: model::CalendarType,
) -> Result<Vec<model::CalendarType>, String> {
    service(&app)?
        .update_calendar(&id, &calendar)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn remove_calendar(app: tauri::AppHandle, id: String) -> Result<Vec<model::CalendarType>, String> {
    service(&app)?
        .remove_calendar(&id)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn save_ics_file(app: tauri::AppHandle, id: String, contents: Vec<u8>) -> Result<String, String> {
    service(&app)?
        .save_ics(&id, &contents)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn read_ics_file(app: tauri::AppHandle, path: String) -> Result<Vec<u8>, String> {
    service(&app)?
        .read_ics(&path)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn get_data_directory(app: tauri::AppHandle) -> Result<String, String> {
    Ok(data_directory(&app)?.to_string_lossy().into_owned())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_uuid::init())
        .invoke_handler(tauri::generate_handler![
            reset_store,
            list_calendars,
            add_calendar,
            sync_calendar,
            update_calendar,
            remove_calendar,
            save_ics_file,
            read_ics_file,
            get_data_directory
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
