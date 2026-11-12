use std::path::{Path, PathBuf};

use crate::model::CalendarType;
use crate::store::{CalendarStore, StoreError};

pub const APP_DATA_DIRECTORY: &str = "ics-gantt";

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
        Self::new(app_data_root.join(APP_DATA_DIRECTORY))
    }

    pub fn calendars(&self) -> Result<Vec<CalendarType>, StoreError> {
        self.store.read()
    }

    pub fn add_calendar(&self, calendar: CalendarType) -> Result<Vec<CalendarType>, StoreError> {
        self.store.save(&calendar)
    }

    pub fn update_calendar(&self, name: String, calendar: CalendarType) -> Result<Vec<CalendarType>, StoreError>  {
        self.store.update(name, &calendar)
    }

    pub fn remove_calendar(&self, name: &str) -> Result<Vec<CalendarType>, StoreError> {
        self.store.remove_named(name)
    }

    pub fn save_all(&self, calendars: &[CalendarType]) -> Result<(), StoreError> {
        self.store.replace(calendars)
    }

    pub fn save_ics(&self, name: &str, contents: &[u8]) -> Result<String, StoreError> {
        self.store.save_ics(name, contents)
    }

    pub fn read_ics(&self, path: &str) -> Result<Vec<u8>, StoreError> {
        self.store.read_ics(path)
    }
}
