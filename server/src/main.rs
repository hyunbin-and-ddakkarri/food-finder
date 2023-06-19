#[cfg(not(feature = "docker"))]
use actix_web::{get, Responder};
use actix_web::{
    App,
    Error,
    HttpResponse, HttpServer, route, web::{self, Data},
};
use actix_web::middleware::Logger;
#[cfg(not(feature = "docker"))]
use actix_web_lab::respond::Html;
use diesel::{PgConnection, r2d2};
use diesel::r2d2::ConnectionManager;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
#[cfg(not(feature = "docker"))]
use juniper::http::graphiql::graphiql_source;
use juniper::http::GraphQLRequest;

use crate::db::{Context, create_schema, Schema};

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

    let port = std::env::var("PORT").unwrap_or_else(|_| "8080".to_string());

    log::info!("starting HTTP server on port {port}");

    #[cfg(feature = "docker")]
    {
        HttpServer::new(move || {
            App::new()
                .app_data(Data::new(pool.clone()))
                .app_data(Data::new(create_schema()))
                .service(graphql)
                .wrap(Logger::default())
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
                .service(graphql)
                .service(graphql_playground)
                .wrap(Logger::default())
        })
            .bind(("0.0.0.0", port.parse().unwrap()))?
            .run()
            .await
    }
}
