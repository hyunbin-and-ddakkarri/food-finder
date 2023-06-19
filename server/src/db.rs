use diesel::prelude::*;
use juniper::{graphql_object, EmptySubscription, FieldResult, GraphQLInputObject, GraphQLObject};
use serde::Deserialize;

use crate::Pool;

/// Simple context for GraphQL schema
pub struct Context {
    pub db_pool: Pool,
}

/// Restaurant Schema
/// This is a schema for both Graphql (Juniper) and Database (Diesel)
#[derive(Queryable, Selectable, Identifiable, Default, Debug, GraphQLObject)]
#[diesel(table_name = crate::schema::restaurant)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Restaurant {
    pub id: String,
    pub name: String,
    pub introduction: String,
    pub address: String,
    pub location_x: f64,
    pub location_y: f64,
    pub region: String,
    pub phone: String,
    pub price: i32,
    pub business_hours: String,
    pub moods: String,
    pub characteristics: String,
    pub images: String,
    pub menus: String,
    pub rating: f64,
}

/// Restaurant Form
/// This is a form for GraphQL (Juniper) and Database (Diesel)
#[derive(Deserialize, Insertable, AsChangeset, GraphQLInputObject)]
#[diesel(table_name = crate::schema::restaurant)]
pub struct RestaurantForm {
    pub id: String,
    pub name: String,
    pub introduction: String,
    pub address: String,
    pub location_x: f64,
    pub location_y: f64,
    pub region: String,
    pub phone: String,
    pub price: i32,
    pub business_hours: String,
    pub moods: String,
    pub characteristics: String,
    pub images: String,
    pub menus: String,
    pub rating: f64,
}

/// Review Schema
/// This is a schema for both Graphql (Juniper) and Database (Diesel)
#[derive(Queryable, Selectable, Identifiable, Associations, Default, Debug, GraphQLObject)]
#[diesel(table_name = crate::schema::review)]
#[diesel(belongs_to(Restaurant))]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Review {
    pub id: String,
    pub username: String,
    pub rating: i32,
    pub context: String,
    pub restaurant_id: String,
}

pub struct Query {}

#[graphql_object(Context = Context)]
impl Query {
    /// List of all restaurants
    #[graphql(description = "List of all restaurants")]
    pub async fn restaurants(context: &Context) -> FieldResult<Vec<Restaurant>> {
        use crate::schema::restaurant::dsl;

        let conn = &mut context.db_pool.get().unwrap();

        let restaurants = dsl::restaurant
            .select(Restaurant::as_select())
            .get_results(conn)?;

        Ok(restaurants)
    }

    /// Get a restaurant by region
    #[graphql(description = "Get a restaurant by region")]
    pub async fn restaurant(context: &Context, region: String) -> FieldResult<Restaurant> {
        use crate::schema::restaurant::dsl;

        let conn = &mut context.db_pool.get().unwrap();

        let res = dsl::restaurant
            .filter(dsl::region.like(format!("%{}%", region)))
            .first(conn)?;

        Ok(res)
    }

    /// List of all reviews from a restaurant
    #[graphql(description = "List of all reviews")]
    pub async fn reviews(context: &Context, restaurant_id: String) -> FieldResult<Vec<Review>> {
        use crate::schema::review::dsl;

        let conn = &mut context.db_pool.get().unwrap();

        let reviews = dsl::review
            .filter(dsl::restaurant_id.eq(restaurant_id))
            .select(Review::as_select())
            .get_results(conn)?;

        Ok(reviews)
    }
}

pub struct Mutation {}

#[graphql_object(Context = Context)]
impl Mutation {
    /// Create a new restaurant if not exists
    /// Update a restaurant if exists
    pub fn update_restaurant(
        context: &Context,
        restaurant: RestaurantForm,
    ) -> FieldResult<Restaurant> {
        use crate::schema::restaurant::dsl;

        let conn = &mut context.db_pool.get().unwrap();

        let res = diesel::insert_into(dsl::restaurant)
            .values(&restaurant)
            .on_conflict(dsl::id)
            .do_update()
            .set(&restaurant)
            .get_result(conn)?;

        Ok(res)
    }
}

pub type Schema = juniper::RootNode<'static, Query, Mutation, EmptySubscription<Context>>;

pub fn create_schema() -> Schema {
    Schema::new(Query {}, Mutation {}, EmptySubscription::new())
}
