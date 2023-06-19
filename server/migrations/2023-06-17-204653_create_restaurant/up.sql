-- Your SQL goes here
create table restaurant
(
    id              serial primary key,
    name            varchar(255) not null,
    introduction    text         not null,
    location_x      float        not null,
    location_y      float        not null,
    region          varchar(255) not null,
    phone           varchar(255) not null,
    price           int          not null,
    business_hours  text         not null,
    moods           text         not null,
    characteristics text         not null,
    images          text         not null,
    menus           text         not null,
    rating          float        not null
);