use actix_web::middleware::Logger;
#[cfg(not(feature = "docker"))]
use actix_web::{get, Responder};
use actix_web::{
    route,
    web::{self, Data},
    App, Error, HttpResponse, HttpServer,
};
#[cfg(not(feature = "docker"))]
use actix_web_lab::respond::Html;
use diesel::r2d2::ConnectionManager;
use diesel::{r2d2, PgConnection};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
#[cfg(not(feature = "docker"))]
use juniper::http::graphiql::graphiql_source;
use juniper::http::GraphQLRequest;

use crate::db::{create_schema, init_category, Context, Schema};

mod db;
mod schema;

pub type Pool = r2d2::Pool<ConnectionManager<PgConnection>>;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./migrations");

/// GraphQL endpoint
#[route("/graphql", method = "GET", method = "POST")]
async fn graphql(
    pool: Data<Pool>,
    schema: Data<Schema>,
    data: web::Json<GraphQLRequest>,
) -> Result<HttpResponse, Error> {
    let ctx = Context {
        db_pool: pool.get_ref().to_owned(),
    };

    let res = data.execute(&schema, &ctx).await;

    Ok(HttpResponse::Ok().json(res))
}

/// GraphiQL UI
#[cfg(not(feature = "docker"))]
#[get("/graphiql")]
async fn graphql_playground() -> impl Responder {
    Html(graphiql_source("/graphql", None))
}

fn make_pool() -> Pool {
    let url = std::env::var("DATABASE_URL").unwrap_or_else(|_| {
        let db_host = std::env::var("DB_HOST").unwrap_or_else(|_| "localhost".to_string());
        let db_port = std::env::var("DB_PORT").unwrap_or_else(|_| "5432".to_string());
        let db_user = std::env::var("DB_USER").unwrap_or_else(|_| "admin".to_string());
        let db_password = std::env::var("DB_PASSWORD").unwrap_or_else(|_| "admin".to_string());
        let db_name = std::env::var("DB_NAME").unwrap_or_else(|_| "postgres".to_string());
        format!(
            "postgres://{}:{}@{}:{}/{}",
            db_user, db_password, db_host, db_port, db_name
        )
    });
    let manager = ConnectionManager::<PgConnection>::new(url);
    Pool::builder()
        .test_on_check_out(true)
        .build(manager)
        .expect("Could not build connection pool")
}

fn run_migrations(pool: &Pool) {
    let conn = &mut pool.get().unwrap();
    let _ = conn.run_pending_migrations(MIGRATIONS);
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let pool = make_pool();
    run_migrations(&pool);
    init_category(&pool);

    let port = std::env::var("PORT").unwrap_or_else(|_| "8080".to_string());

    log::info!("starting HTTP server on port {port}");

    #[cfg(feature = "docker")]
    {
        HttpServer::new(move || {
            App::new()
                .app_data(Data::new(pool.clone()))
                .app_data(Data::new(create_schema()))
                .wrap(Logger::default())
                .service(graphql)
        })
        .bind(("0.0.0.0", port.parse().unwrap()))?
        .run()
        .await
    }

    #[cfg(not(feature = "docker"))]
    {
        log::info!("GraphiQL playground: http://localhost:{port}/graphiql");
        HttpServer::new(move || {
            App::new()
                .app_data(Data::new(pool.clone()))
                .app_data(Data::new(create_schema()))
                .wrap(Logger::default())
                .service(graphql)
                .service(graphql_playground)
        })
        .bind(("0.0.0.0", port.parse().unwrap()))?
        .run()
        .await
    }
}

#[cfg(test)]
mod tests {
    use actix_web::{http::header::ContentType, test};
    use serde_json::json;

    use super::*;

    #[actix_web::test]
    async fn test_simple() {
        let pool = make_pool();
        run_migrations(&pool);

        let app = test::init_service(
            App::new()
                .app_data(Data::new(pool.clone()))
                .app_data(Data::new(create_schema()))
                .service(graphql),
        )
        .await;

        let req = test::TestRequest::post()
            .uri("/graphql")
            .insert_header(ContentType::json())
            .set_payload(
                json!(
                    {
                        "query": "{restaurants{id}}"
                    }
                )
                .to_string(),
            )
            .to_request();
        let resp = test::call_service(&app, req).await;
        assert!(resp.status().is_success());
    }

    #[actix_web::test]
    async fn test_insert_and_get() {
        let pool = make_pool();
        run_migrations(&pool);

        let app = test::init_service(
            App::new()
                .app_data(Data::new(pool.clone()))
                .app_data(Data::new(create_schema()))
                .service(graphql),
        )
        .await;

        let req = test::TestRequest::post()
            .uri("/graphql")
            .insert_header(ContentType::json())
            .set_payload(json!(
                {
                    "query": "mutation updateRestaurant($restaurant: RestaurantForm!) {
                        updateRestaurant(restaurant: $restaurant) { id }
                    }",
                    "variables": {
                        "restaurant": {
                            "id": "1",
                            "name": "test1",
                            "introduction": "this is a good restaurant",
                            "address": "seoul, korea",
                            "locationX": 1.0,
                            "locationY": 2.0,
                            "region": "seoul",
                            "phone": "010-1234-5678",
                            "price": 10000,
                            "businessHours": "{'monday': ['11:00', '20:00']}",
                            "moods": "['good mood']",
                            "characteristics": "",
                            "images": "['https://example.com/image1.jpg', 'https://example.com/image2.jpg']",
                            "menus": "{'kimbap': 10000}",
                            "rating": 4.5
                        }
                    }
                }).to_string())
            .to_request();
        let resp = test::call_service(&app, req).await;
        assert!(resp.status().is_success());

        let req = test::TestRequest::post()
            .uri("/graphql")
            .insert_header(ContentType::json())
            .set_payload(
                json!(
                    {
                        "query": "{restaurant(region: \"seoul\"){id}}"
                    }
                )
                .to_string(),
            )
            .to_request();

        let resp = test::call_service(&app, req).await;
        let json = test::read_body_json::<serde_json::Value, _>(resp).await;
        assert_eq!(json["data"]["restaurant"]["id"], "1");

        let req = test::TestRequest::post()
            .uri("/graphql")
            .insert_header(ContentType::json())
            .set_payload(
                json!(
                    {
                        "query": "{restaurant(region: \"daejeon\"){id}}"
                    }
                )
                .to_string(),
            )
            .to_request();
        let resp = test::call_service(&app, req).await;
        let json = test::read_body_json::<serde_json::Value, _>(resp).await;
        assert_eq!(json["data"], json!(null));
    }
}
