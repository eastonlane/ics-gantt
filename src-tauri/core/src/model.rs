use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "lowercase")]
pub enum CalendarType {
    File(FileCalendarStoreType),
    Url(UrlCalendarStoreType),
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FileCalendarStoreType {
    pub id: String,
    pub name: String,
    pub path: String,
    pub created: i64,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UrlCalendarStoreType {
    pub id: String,
    pub name: String,
    pub path: String,
    pub url: String,
    pub created: i64,
    pub last_sync: i64,
}

impl CalendarType {
    fn new_id() -> String {
        Uuid::now_v7().to_string()
    }

    pub fn ensure_id(calendar: CalendarType) -> CalendarType {
        if !calendar.id().is_empty() {
            return calendar;
        }
        match calendar {
            CalendarType::File(mut cal) => {
                if cal.id.is_empty() {
                    cal.id = Self::new_id()
                }
                CalendarType::File(cal)
            }
            CalendarType::Url(mut cal) => {
                if cal.id.is_empty() {
                    cal.id = Self::new_id()
                }
                CalendarType::Url(cal)
            }
        }
    }

    pub fn id(&self) -> &str {
        match self {
            Self::File(calendar) => &calendar.id,
            Self::Url(calendar) => &calendar.id,
        }
    }

    pub fn name(&self) -> &str {
        match self {
            Self::File(calendar) => &calendar.name,
            Self::Url(calendar) => &calendar.name,
        }
    }
}
