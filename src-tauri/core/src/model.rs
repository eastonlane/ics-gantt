use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "lowercase")]
pub enum CalendarType {
    File(FileCalendarStoreType),
    Url(UrlCalendarStoreType),
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FileCalendarStoreType {
    pub name: String,
    pub path: String,
    pub created: i64,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UrlCalendarStoreType {
    pub name: String,
    pub path: String,
    pub url: String,
    pub created: i64,
    pub last_sync: i64,
}

impl CalendarType {
    pub fn name(&self) -> &str {
        match self {
            Self::File(calendar) => &calendar.name,
            Self::Url(calendar) => &calendar.name,
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
    root.join("calendars").join(safe_filename(name))
}
