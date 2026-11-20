use serde::{Deserialize, Serialize};

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
