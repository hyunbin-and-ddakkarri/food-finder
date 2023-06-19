-- Your SQL goes here

create table review
(
    id         serial primary key,
    username   varchar(255) not null,
    rating     int          not null,
    context    text         not null,
    date       date         not null,
    restaurant serial references restaurant (id)
);