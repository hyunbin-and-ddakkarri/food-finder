-- Your SQL goes here

create table subcategory
(
    id          serial primary key,
    name        varchar(255) not null,
    image       text         not null,
    category_id int          not null references category (id)
);
