// @generated automatically by Diesel CLI.

diesel::table! {
    restaurant (id) {
        #[max_length = 255]
        id -> Varchar,
        #[max_length = 255]
        name -> Varchar,
        introduction -> Text,
        #[max_length = 255]
        address -> Varchar,
        location_x -> Float8,
        location_y -> Float8,
        #[max_length = 255]
        region -> Varchar,
        #[max_length = 255]
        phone -> Varchar,
        price -> Int4,
        business_hours -> Text,
        moods -> Text,
        characteristics -> Text,
        images -> Text,
        menus -> Text,
        rating -> Float8,
    }
}

diesel::table! {
    review (id) {
        #[max_length = 255]
        id -> Varchar,
        #[max_length = 255]
        username -> Varchar,
        rating -> Int4,
        context -> Text,
        date -> Date,
        #[max_length = 255]
        restaurant_id -> Varchar,
    }
}

diesel::joinable!(review -> restaurant (restaurant_id));

diesel::allow_tables_to_appear_in_same_query!(
    restaurant,
    review,
);
