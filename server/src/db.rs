use diesel::prelude::*;
use juniper::graphql_object;
use juniper::EmptySubscription;
use juniper::FieldResult;
use juniper::GraphQLInputObject;
use juniper::GraphQLObject;
use serde::Deserialize;

use crate::Pool;

pub struct Context {
    pub db_pool: Pool,
}

#[derive(Queryable, Selectable, Default, Debug, GraphQLObject)]
#[diesel(table_name = crate::schema::restaurant)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Restaurant {
    pub id: i32,
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

#[derive(Deserialize, Insertable, GraphQLInputObject)]
#[diesel(table_name = crate::schema::restaurant)]
pub struct RestaurantForm {
    pub id: i32,
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

pub struct Query {}

#[graphql_object(Context = Context)]
impl Query {
    #[graphql(description = "List of all restaurants")]
    pub async fn restaurants(context: &Context) -> FieldResult<Vec<Restaurant>> {
        use crate::schema::restaurant::dsl;

        let conn = &mut context.db_pool.get().unwrap();

        let restaurants = dsl::restaurant
            .select(crate::schema::restaurant::all_columns)
            .load::<Restaurant>(conn)
            .unwrap();

        Ok(restaurants)
    }

    #[graphql(description = "Get a restaurant by ID")]
    pub async fn restaurant(context: &Context, region: String) -> FieldResult<Restaurant> {
        use crate::schema::restaurant::dsl;

        let conn = &mut context.db_pool.get().unwrap();

        let res = dsl::restaurant
            .filter(dsl::region.like(format!("%{}%", region)))
            .first::<Restaurant>(conn)
            .unwrap();

        Ok(res)
    }
}

pub struct Mutation {}

#[graphql_object(Context = Context)]
impl Mutation {
    pub fn create_restaurant(
        context: &Context,
        restaurant: RestaurantForm,
    ) -> FieldResult<Restaurant> {
        use crate::schema::restaurant::dsl;

        let conn = &mut context.db_pool.get().unwrap();

        let res = diesel::insert_into(dsl::restaurant)
            .values(&restaurant)
            .get_result(conn)
            .unwrap();

        Ok(res)
    }
}

pub type Schema = juniper::RootNode<'static, Query, Mutation, EmptySubscription<Context>>;

pub fn create_schema() -> Schema {
    Schema::new(Query {}, Mutation {}, EmptySubscription::new())
}
