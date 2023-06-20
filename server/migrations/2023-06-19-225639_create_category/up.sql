-- Your SQL goes here

create table category
(
    id    serial primary key,
    name  varchar(255) not null unique,
    image text         not null
);
