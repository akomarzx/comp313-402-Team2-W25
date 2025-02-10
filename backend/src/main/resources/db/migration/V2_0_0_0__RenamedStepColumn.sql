create table
    if not exists `rating` (
                                  `rating_id` int primary key,
                                  `rating_value` decimal(1, 2) not null,
                                  `recipe_id` int,
                                  `created_at` timestamp default current_timestamp(),
                                  `created_by` varchar(256) not null,
                                  `updated_at` timestamp,
                                  `updated_by` varchar(256),
                                  foreign key (`recipe_id`) references `recipe` (`recipe_id`),
                                  unique index `uidx_rating_rating_created_by` (`created_by`, recipe_id)
) engine = innodb;

create index `rating_recipe_id_idx` on `rating` (`recipe_id`);
create index `rating_created_by_idx` on `rating` (`created_by`);

create table
    if not exists `rating_calculated` (
                            `recipe_id` int primary key ,
                            `rating_value` decimal(1, 2) not null,
                            foreign key (`recipe_id`) references `recipe` (`recipe_id`)
) engine = innodb;
