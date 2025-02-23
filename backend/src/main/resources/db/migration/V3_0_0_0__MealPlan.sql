insert into
    `code_book` (
    `code_book_id`,
    `label`,
    `created_at`,
    `created_by`,
    `updated_at`,
    `updated_by`
)
values
    (
        200,
        'days of week',
        current_timestamp(),
        'sysadmin@mail.com',
        null,
        null
    );


insert into `code_value` (`code_value_id`, `code_book_id`, `label`, `created_at`, `created_by`, `updated_at`, `updated_by`)
values
    (200, 200, 'Monday', current_timestamp(), 'sysadmin@mail.com', null, null),
    (201, 200, 'Tuesday', current_timestamp(), 'sysadmin@mail.com', null, null),
    (202, 200, 'Wednesday', current_timestamp(), 'sysadmin@mail.com', null, null),
    (203, 200, 'Thursday', current_timestamp(), 'sysadmin@mail.com', null, null),
    (204, 200, 'Friday', current_timestamp(), 'sysadmin@mail.com', null, null),
    (205, 200, 'Saturday', current_timestamp(), 'sysadmin@mail.com', null, null),
    (206, 200, 'Sunday', current_timestamp(), 'sysadmin@mail.com', null, null);

create table
    if not exists `meal_plan` (
       `meal_plan_id` int primary key auto_increment,
       `label` varchar(256) not null,
       `created_at` timestamp not null,
       `created_by` varchar(256) not null,
       `updated_at` timestamp,
       `updated_by` varchar(256)
    ) engine = innodb;

create index `meal_plan_created_by_idx` on `meal_plan` (`created_by`);

create table
    if not exists `meal_plan_group` (
          `meal_plan_group_id` int primary key auto_increment,
          `meal_plan_id` int not null,
          `label` varchar(256) not null,
          `created_at` timestamp not null,
          `created_by` varchar(256) not null,
          `updated_at` timestamp,
          `updated_by` varchar(256),
          foreign key (`meal_plan_id`) references `meal_plan` (`meal_plan_id`)
) engine = innodb;

create index `meal_plan_group_created_by_idx` on `meal_plan_group` (`created_by`);
create index `meal_plan_group_meal_plan_id_idx` on `meal_plan_group` (`meal_plan_id`);

create table
    if not exists `meal_plan_days` (
        `meal_plan_days_id` int primary key auto_increment,
        `meal_plan_group_id` int not null,
        `breakfast_recipe_id` int null,
        `breakfast_recipe_substitute` varchar(256) null,
        `lunch_recipe_id` int null,
        `lunch_recipe_substitute` varchar(256) null,
        `dinner_recipe_id` int null,
        `dinner_recipe_substitute` varchar(256) null,
        `day_of_week_code` int not null,
        `created_at` timestamp not null,
        `created_by` varchar(256) not null,
        `updated_at` timestamp,
        `updated_by` varchar(256),
        foreign key (`meal_plan_group_id`) references `meal_plan_group` (`meal_plan_group_id`),
        foreign key (`breakfast_recipe_id`) references `recipe` (`recipe_id`),
        foreign key (`lunch_recipe_id`) references `recipe` (`recipe_id`),
        foreign key (`dinner_recipe_id`) references `recipe` (`recipe_id`),
        foreign key (`day_of_week_code`) references `code_value` (`code_value_id`),
        unique index `uidx_meal_plan_days_meal_group_id_days_of_week_code` (`meal_plan_group_id`, `day_of_week_code`)
) engine = innodb;

create index `meal_plan_days_meal_group_id_idx` on `meal_plan_days` (`meal_plan_group_id`);
create index `meal_plan_days_breakfast_recipe_id_idx` on `meal_plan_days` (`breakfast_recipe_id`);
create index `meal_plan_days_lunch_recipe_id_idx` on `meal_plan_days` (`lunch_recipe_id`);
create index `meal_plan_days_dinner_recipe_id_idx` on `meal_plan_days` (`dinner_recipe_id`);
create index `meal_plan_days_days_of_week_code_idx` on `meal_plan_days` (`day_of_week_code`);
