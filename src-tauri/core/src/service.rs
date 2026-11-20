use std::path::{Path, PathBuf};
use std::time::{SystemTime, SystemTimeError, UNIX_EPOCH};

use crate::api;
use crate::model::CalendarType;
use crate::store::{CalendarStore, StoreError};

pub const DATA_DIR_NAME: &str = "data";

#[derive(Debug, Clone)]
pub struct CalendarService {
    store: CalendarStore,
}

impl CalendarService {
    pub fn new(data_directory: impl Into<PathBuf>) -> Self {
        Self {
            store: CalendarStore::new(data_directory),
        }
    }

    pub fn from_app_data_root(app_data_root: &Path) -> Self {
        Self::new(app_data_root.join(DATA_DIR_NAME))
    }

    pub fn reset(&self) -> Result<(), ServiceError> {
        self.store.reset().map_err(ServiceError::Store)
    }

    pub fn calendars(&self) -> Result<Vec<CalendarType>, ServiceError> {
        self.store.read().map_err(ServiceError::Store)
    }

    pub async fn add_calendar(
        &self,
        calendar: CalendarType,
    ) -> Result<Vec<CalendarType>, ServiceError> {
        let calendar = match calendar {
            CalendarType::Url(mut url_calendar) => {
                let contents = api::get_ics_from_url(&url_calendar.url)
                    .await
                    .map_err(ServiceError::API)?;
                let path = self
                    .store
                    .save_ics(&url_calendar.name, contents.as_bytes())
                    .map_err(ServiceError::Store)?;
                url_calendar.path = path.clone();
                url_calendar.last_sync = SystemTime::now()
                    .duration_since(UNIX_EPOCH)
                    .map_err(ServiceError::Clock)?
                    .as_secs() as i64;
                CalendarType::Url(url_calendar)
            }
            _ => calendar,
        };
        self.store.save(&calendar).map_err(ServiceError::Store)
    }

    pub async fn sync_calendar(&self, name: String) -> Result<Vec<u8>, ServiceError> {
        let mut calendars = self.store.read().map_err(ServiceError::Store)?;
        let calendar = calendars
            .iter_mut()
            .find(|calendar| calendar.name() == name)
            .ok_or(ServiceError::NotFound)?;

        let CalendarType::Url(url_calendar) = calendar else {
            return Err(ServiceError::NotFound);
        };

        let contents = api::get_ics_from_url(&url_calendar.url)
            .await
            .map_err(ServiceError::API)?;
        let path = self
            .store
            .save_ics(&name, contents.as_bytes())
            .map_err(ServiceError::Store)?;

        url_calendar.path = path.clone();
        url_calendar.last_sync = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map_err(ServiceError::Clock)?
            .as_secs() as i64;

        self.store
            .update(&name, calendar)
            .map_err(ServiceError::Store)?;

        self.read_ics(&path)
    }

    pub fn update_calendar(
        &self,
        name: &String,
        calendar: &CalendarType,
    ) -> Result<Vec<CalendarType>, ServiceError> {
        self.store
            .update(name, &calendar)
            .map_err(ServiceError::Store)
    }

    pub fn remove_calendar(&self, name: &str) -> Result<Vec<CalendarType>, ServiceError> {
        self.store.remove_ics(name).map_err(ServiceError::Store)?;
        self.store.remove_named(name).map_err(ServiceError::Store)
    }

    pub fn save_all(&self, calendars: &[CalendarType]) -> Result<(), ServiceError> {
        self.store.replace(calendars).map_err(ServiceError::Store)
    }

    pub fn save_ics(&self, name: &str, contents: &[u8]) -> Result<String, ServiceError> {
        self.store
            .save_ics(name, contents)
            .map_err(ServiceError::Store)
    }

    pub fn read_ics(&self, path: &str) -> Result<Vec<u8>, ServiceError> {
        self.store.read_ics(path).map_err(ServiceError::Store)
    }

    pub fn remove_ics(&self, name: &str) -> Result<(), ServiceError> {
        self.store.remove_ics(name).map_err(ServiceError::Store)
    }
}

#[derive(Debug)]
pub enum ServiceError {
    Store(StoreError),
    API(reqwest::Error),
    Clock(SystemTimeError),
    NotFound,
}

impl std::fmt::Display for ServiceError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Store(err) => write!(formatter, "calendar store error: {err}"),
            Self::API(err) => write!(formatter, "Http reqesut error: {err}"),
            Self::NotFound => write!(formatter, "Target calendar not found"),
            Self::Clock(err) => write!(formatter, "System time error {err}"),
        }
    }
}

impl std::error::Error for ServiceError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        Some(self)
    }
}
