-- Your SQL goes here

create table review
(
    id         varchar(255) primary key,
    username   varchar(255) not null,
    rating     int          not null,
    context    text         not null,
    date       date         not null,
    restaurant varchar(255) references restaurant (id)
);