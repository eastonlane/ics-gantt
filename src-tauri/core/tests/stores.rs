use tempfile::tempdir;

use ics_gantt_core::model::{CalendarType, FileCalendarStoreType, UrlCalendarStoreType};
use ics_gantt_core::store::{CalendarStore, safe_filename};

fn file_calendar(name: &str, created: i64) -> CalendarType {
    CalendarType::File(FileCalendarStoreType {
        name: name.to_owned(),
        path: format!("/calendar/{name}.ics"),
        created,
    })
}

fn url_calendar(name: &str, created: i64) -> CalendarType {
    CalendarType::Url(UrlCalendarStoreType {
        name: name.to_owned(),
        path: format!("/calendar/{name}.ics"),
        url: format!("https://example.com/{name}.ics"),
        created,
        last_sync: created,
    })
}

#[test]
fn first_read_is_empty_and_does_not_require_a_file() {
    let directory = tempdir().unwrap();
    let store = CalendarStore::new(directory.path());
    assert!(store.read().unwrap().is_empty());
    assert!(!store.store_file_path().exists());
}

#[test]
fn saves_and_reads_both_calendar_variants() {
    let directory = tempdir().unwrap();
    let store = CalendarStore::new(directory.path());
    let file = file_calendar("file", 1);
    let url = url_calendar("url", 2);
    store.save(&file).unwrap();
    let calendars = store.save(&url).unwrap();
    assert_eq!(calendars, vec![file, url]);
    assert_eq!(store.read().unwrap(), calendars);
}

#[test]
fn removes_a_calendar_by_name() {
    let directory = tempdir().unwrap();
    let store = CalendarStore::new(directory.path());
    let keep = file_calendar("keep", 1);
    let remove = url_calendar("remove", 2);
    store.save(&keep).unwrap();
    store.save(&remove).unwrap();
    assert_eq!(store.remove_named("remove").unwrap(), vec![keep]);
}

#[test]
fn empty_file_is_treated_as_an_empty_store() {
    let directory = tempdir().unwrap();
    let store = CalendarStore::new(directory.path());
    std::fs::write(store.store_file_path(), "").unwrap();
    assert!(store.read().unwrap().is_empty());
}

#[test]
fn strips_path_characters_from_managed_file_names() {
    assert_eq!(safe_filename("../../my:calendar"), "_.._my_calendar.ics");
    assert_eq!(safe_filename("events.ICS"), "events.ICS");
}

#[test]
fn saves_ics_contents_under_the_managed_directory() {
    let directory = tempdir().unwrap();
    let store = CalendarStore::new(directory.path());
    let path = store.save_ics("sample", b"BEGIN:VCALENDAR").unwrap();
    assert!(path.ends_with("calendars/sample.ics") || path.ends_with("calendars\\sample.ics"));
    assert_eq!(std::fs::read(path).unwrap(), b"BEGIN:VCALENDAR");
}
