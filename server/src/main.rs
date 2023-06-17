use actix_web::{
    App, Error,
    get,
    HttpResponse, HttpServer, Responder, route, web::{self, Data},
};
use actix_web::middleware::Logger;
use actix_web_lab::respond::Html;
use diesel::{PgConnection, r2d2};
use diesel::r2d2::ConnectionManager;
use juniper::http::{graphiql::graphiql_source, GraphQLRequest};
use crate::db::{Context, create_schema, Schema};


mod schema;
mod db;

pub type Pool = r2d2::Pool<ConnectionManager<PgConnection>>;

pub struct Database {
    pool: Pool,
}

/// GraphQL endpoint
#[route("/graphql", method = "GET", method = "POST")]
pub async fn graphql(
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

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let pool = make_pool();

    log::info!("starting HTTP server on port 8080");
    log::info!("GraphiQL playground: http://localhost:8080/graphiql");

    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(pool.clone()))
            .app_data(Data::new(create_schema()))
            .service(graphql)
            .service(graphql_playground)
            .wrap(Logger::default())
    })
        .bind(("0.0.0.0", 8080))?
        .run()
        .await
}
