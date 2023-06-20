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

/// Category Schema
/// This is a schema for both Graphql (Juniper) and Database (Diesel)
#[derive(Queryable, Selectable, Identifiable, Default, Debug, GraphQLObject)]
#[diesel(table_name = crate::schema::category)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Category {
    pub id: i32,
    pub name: String,
    pub image: String,
}

/// Category Form
/// This is a form for GraphQL (Juniper) and Database (Diesel)
#[derive(Default, Debug, Deserialize, Insertable, AsChangeset, GraphQLInputObject)]
#[diesel(table_name = crate::schema::category)]
pub struct CategoryForm {
    pub name: String,
    pub image: String,
}

/// Subcategory Schema
/// This is a schema for both Graphql (Juniper) and Database (Diesel)
#[derive(Queryable, Selectable, Identifiable, Associations, Default, Debug, GraphQLObject)]
#[diesel(table_name = crate::schema::subcategory)]
#[diesel(belongs_to(Category))]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Subcategory {
    pub id: i32,
    pub name: String,
    pub image: String,
    pub category_id: i32,
}

/// Subcategory Form
/// This is a form for GraphQL (Juniper) and Database (Diesel)
#[derive(Deserialize, Insertable, AsChangeset, GraphQLInputObject)]
#[diesel(table_name = crate::schema::subcategory)]
pub struct SubcategoryForm {
    pub name: String,
    pub image: String,
    pub category_id: i32,
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

    /// List of all categories
    #[graphql(description = "List of all categories")]
    pub async fn categories(context: &Context) -> FieldResult<Vec<Category>> {
        use crate::schema::category::dsl;

        let conn = &mut context.db_pool.get().unwrap();

        let categories = dsl::category
            .select(Category::as_select())
            .get_results(conn)?;

        Ok(categories)
    }

    /// List of all subcategories
    #[graphql(description = "List of all subcategories")]
    pub async fn subcategories(context: &Context) -> FieldResult<Vec<Subcategory>> {
        use crate::schema::subcategory::dsl;

        let conn = &mut context.db_pool.get().unwrap();

        let subcategories = dsl::subcategory
            .select(Subcategory::as_select())
            .get_results(conn)?;

        Ok(subcategories)
    }

    /// List of all subcategories from a category
    #[graphql(description = "List of all subcategories from a category")]
    pub async fn subcategory(context: &Context, category_id: i32) -> FieldResult<Vec<Subcategory>> {
        use crate::schema::subcategory::dsl;

        let conn = &mut context.db_pool.get().unwrap();

        let subcategories = dsl::subcategory
            .filter(dsl::category_id.eq(category_id))
            .select(Subcategory::as_select())
            .get_results(conn)?;

        Ok(subcategories)
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

    /// Create a new category if not exists
    /// Update a category if exists
    pub fn update_category(context: &Context, category: CategoryForm) -> FieldResult<Category> {
        use crate::schema::category::dsl;

        let conn = &mut context.db_pool.get().unwrap();

        let res = diesel::insert_into(dsl::category)
            .values(&category)
            .on_conflict(dsl::name)
            .do_update()
            .set(&category)
            .get_result(conn)?;

        Ok(res)
    }

    /// Create a new subcategory if not exists
    /// Update a subcategory if exists
    pub fn update_subcategory(
        context: &Context,
        subcategory: SubcategoryForm,
    ) -> FieldResult<Subcategory> {
        use crate::schema::subcategory::dsl;

        let conn = &mut context.db_pool.get().unwrap();

        let res = diesel::insert_into(dsl::subcategory)
            .values(&subcategory)
            .on_conflict(dsl::name)
            .do_update()
            .set(&subcategory)
            .get_result(conn)?;

        Ok(res)
    }
}

pub type Schema = juniper::RootNode<'static, Query, Mutation, EmptySubscription<Context>>;

pub fn create_schema() -> Schema {
    Schema::new(Query {}, Mutation {}, EmptySubscription::new())
}

const CATEGORY: &str = include_str!("./category.json");

pub fn init_category(pool: &Pool) {
    use crate::schema::category::dsl as category_dsl;
    use crate::schema::subcategory::dsl as subcategory_dsl;

    let categories = serde_json::from_str::<serde_json::Value>(CATEGORY).unwrap();

    let conn = &mut pool.get().unwrap();

    for (category, info) in categories.as_object().unwrap() {
        let cat = CategoryForm {
            name: category.to_string(),
            image: info["image"].as_str().unwrap().to_string(),
        };

        diesel::insert_into(category_dsl::category)
            .values(&cat)
            .on_conflict(category_dsl::name)
            .do_nothing()
            .execute(conn)
            .unwrap();

        let id = category_dsl::category
            .filter(category_dsl::name.eq(category))
            .select(category_dsl::id)
            .first::<i32>(conn)
            .unwrap();

        for (subcategory, info) in info["sub"].as_object().unwrap() {
            let sub = SubcategoryForm {
                name: subcategory.to_string(),
                image: info["image"].as_str().unwrap().to_string(),
                category_id: id,
            };

            diesel::insert_into(subcategory_dsl::subcategory)
                .values(&sub)
                .on_conflict((subcategory_dsl::name, subcategory_dsl::category_id))
                .do_nothing()
                .execute(conn)
                .unwrap();
        }
    }
}
