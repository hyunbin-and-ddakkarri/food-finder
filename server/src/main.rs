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

use crate::db::{create_schema, Context, Schema};

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
    let url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
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
