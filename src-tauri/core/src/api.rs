use reqwest::{self, Error};

pub async fn get_ics_from_url(url: &str) -> Result<String, Error> {
    reqwest::get(url).await?.text().await
}
