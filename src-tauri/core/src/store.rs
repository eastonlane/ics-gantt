use std::fs;
use std::io;
use std::path::{Path, PathBuf};

use crate::model::CalendarType;

const STORE_FILE_NAME: &str = "calendars.json";
const STORE_ICS_FILE_MANAGE_DIR_NAME: &str = "calendars";

#[derive(Debug, Clone)]
pub struct CalendarStore {
    data_path_root: PathBuf,
}

impl CalendarStore {
    pub fn new(data_path_root: impl Into<PathBuf>) -> Self {
        Self {
            data_path_root: data_path_root.into(),
        }
    }

    pub fn store_file_path(&self) -> PathBuf {
        self.data_path_root.join(STORE_FILE_NAME)
    }

    pub fn reset(&self) -> Result<(), StoreError> {
        fs::remove_file(self.store_file_path()).map_err(StoreError::Io)?;
        fs::remove_dir_all(self.data_path_root.join(STORE_ICS_FILE_MANAGE_DIR_NAME))
            .map_err(StoreError::Io)?;
        Ok(())
    }

    pub fn read(&self) -> Result<Vec<CalendarType>, StoreError> {
        let path = self.store_file_path();
        let raw = match fs::read_to_string(&path) {
            Ok(raw) => raw,
            Err(error) if error.kind() == io::ErrorKind::NotFound => return Ok(Vec::new()),
            Err(error) => return Err(StoreError::Io(error)),
        };
        if raw.trim().is_empty() {
            return Ok(Vec::new());
        }
        serde_json::from_str(&raw).map_err(StoreError::Json)
    }

    pub fn write(&self, calendars: &[CalendarType]) -> Result<(), StoreError> {
        fs::create_dir_all(&self.data_path_root).map_err(StoreError::Io)?;
        let path = self.store_file_path();
        let temporary_path = path.with_extension("json.tmp");
        let json = serde_json::to_vec_pretty(calendars).map_err(StoreError::Json)?;
        fs::write(&temporary_path, json).map_err(StoreError::Io)?;
        fs::rename(&temporary_path, &path).map_err(StoreError::Io)
    }

    pub fn save(&self, calendar: &CalendarType) -> Result<Vec<CalendarType>, StoreError> {
        let mut calendars = self.read()?;
        calendars.push(calendar.clone());
        self.write(&calendars)?;
        Ok(calendars)
    }

    pub fn update(
        &self,
        name: &String,
        calendar: &CalendarType,
    ) -> Result<Vec<CalendarType>, StoreError> {
        let mut calendars = self.read()?;
        for cal in calendars.iter_mut() {
            if cal.name() == name {
                *cal = calendar.clone();
                break;
            }
        }
        self.write(&calendars)?;
        Ok(calendars)
    }

    pub fn replace(&self, calendars: &[CalendarType]) -> Result<(), StoreError> {
        self.write(calendars)
    }

    pub fn remove_named(&self, name: &str) -> Result<Vec<CalendarType>, StoreError> {
        let calendars: Vec<_> = self
            .read()?
            .into_iter()
            .filter(|calendar| calendar.name() != name)
            .collect();
        self.write(&calendars)?;
        Ok(calendars)
    }

    pub fn data_path_root(&self) -> &Path {
        &self.data_path_root
    }

    pub fn save_ics(&self, name: &str, contents: &[u8]) -> Result<String, StoreError> {
        let path = managed_ics_path(&self.data_path_root, name);
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent).map_err(StoreError::Io)?;
        }
        fs::write(&path, contents).map_err(StoreError::Io)?;
        Ok(path.to_string_lossy().into_owned())
    }

    pub fn read_ics(&self, path: &str) -> Result<Vec<u8>, StoreError> {
        let root = self.data_path_root.canonicalize().map_err(StoreError::Io)?;
        let target = PathBuf::from(path).canonicalize().map_err(StoreError::Io)?;
        if !target.starts_with(&root) {
            return Err(StoreError::InvalidPath(target));
        }
        fs::read(target).map_err(StoreError::Io)
    }

    pub fn remove_ics(&self, name: &str) -> Result<(), StoreError> {
        let path = managed_ics_path(&self.data_path_root, name);
        if fs::exists(path.clone()).map_err(StoreError::Io)? {
            fs::remove_file(path).map_err(StoreError::Io)?;
        }
        Ok(())
    }
}

#[derive(Debug)]
pub enum StoreError {
    Io(io::Error),
    Json(serde_json::Error),
    InvalidPath(PathBuf),
}

impl std::fmt::Display for StoreError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io(error) => write!(formatter, "calendar store I/O error: {error}"),
            Self::Json(error) => write!(formatter, "calendar store JSON error: {error}"),
            Self::InvalidPath(path) => {
                write!(
                    formatter,
                    "calendar path is outside app data: {}",
                    path.display()
                )
            }
        }
    }
}

impl std::error::Error for StoreError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            Self::Io(error) => Some(error),
            Self::Json(error) => Some(error),
            Self::InvalidPath(_) => None,
        }
    }
}

pub fn safe_filename(name: &str) -> String {
    let sanitized: String = name
        .chars()
        .map(|character| match character {
            '/' | '\\' | ':' | '*' | '?' | '"' | '<' | '>' | '|' => '_',
            other => other,
        })
        .collect();
    let trimmed = sanitized.trim().trim_matches('.').trim();
    if trimmed.is_empty() {
        "calendar.ics".to_owned()
    } else if trimmed.to_ascii_lowercase().ends_with(".ics") {
        trimmed.to_owned()
    } else {
        format!("{trimmed}.ics")
    }
}

pub fn managed_ics_path(root: &Path, name: &str) -> PathBuf {
    root.join(STORE_ICS_FILE_MANAGE_DIR_NAME)
        .join(safe_filename(name))
}
