create table
    if not exists `code_book` (
        `code_book_id` int primary key,
        `label` varchar(256) not null,
        `created_at` timestamp default current_timestamp(),
        `created_by` varchar(256) not null,
        `updated_at` timestamp,
        `updated_by` varchar(256)
    ) engine = innodb;

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
        100,
        'timeunit',
        current_timestamp(),
        'sysadmin@mail.com',
        null,
        null
    );

create table
    if not exists `code_value` (
        `code_value_id` int primary key,
        `code_book_id` int not null,
        `label` varchar(256) not null,
        `created_at` timestamp not null,
        `created_by` varchar(256) not null,
        `updated_at` timestamp,
        `updated_by` varchar(256),
        foreign key (`code_book_id`) references `code_book` (`code_book_id`) on update restrict on delete cascade
    ) engine = innodb;

insert into `code_value` (`code_value_id`, `code_book_id`, `label`, `created_at`, `created_by`, `updated_at`, `updated_by`)
values
    (100, 100, 'minutes', current_timestamp(), 'sysadmin@mail.com', null, null),
    (101, 100, 'hours', current_timestamp(), 'sysadmin@mail.com', null, null),
    (102, 100, 'days', current_timestamp(), 'sysadmin@mail.com', null, null);

#create index `code_value_code_book_id_idx` on `code_value` (`code_book_id`);

create table
    if not exists `category` (
        `category_id` int auto_increment primary key,
        `label` varchar(255) not null unique,
        `created_at` timestamp not null,
        `created_by` varchar(256) not null,
        `updated_at` timestamp,
        `updated_by` varchar(256)
    );

create table 
    if not exists `recipe` (
        `recipe_id` int auto_increment primary key,
        `title` varchar(256) not null,
        `summary` varchar(10000),
        `prep_time` int not null,
        `prep_time_unit_cd` int,
        `cook_time` int not null,
        `cook_time_unit_cd` int,
        `servings` int not null,
        `yield` varchar(255) null,
        `image_url` varchar(500),
        `thumbnail_url` varchar(500),
        `calories` decimal(10,2) default 0.0,
        `carbs_g` decimal(10,2) default 0.0,
        `sugars_g` decimal(10,2) default 0.0,
        `fat_g` decimal(10,2) default 0.0,
        `created_by` varchar(256) not null,
        `created_at` timestamp default current_timestamp,
        `updated_at` timestamp on update current_timestamp,
        `updated_by` varchar(256),
        foreign key (`prep_time_unit_cd`) references `code_value` (`code_value_id`),
        foreign key (`cook_time_unit_cd`) references `code_value` (`code_value_id`)
    );

#create index `idx_recipe_created_by` on `recipe` (`created_by`);
#create index `idx_recipe_prep_time_unit_cd` on `recipe` (`prep_time_unit_cd`);
#create index `idx_recipe_cook_time_unit_cd` on `recipe` (`cook_time_unit_cd`);

create table
    if not exists `recipe_category` (
        `category_id` int not null,
        `recipe_id` int not null,
        `created_at` timestamp not null,
        `created_by` varchar(256) not null,
        `updated_at` timestamp,
        `updated_by` varchar(256),
        foreign key (`category_id`) references `category` (`category_id`),
        foreign key (`recipe_id`) references `recipe` (`recipe_id`),
        primary key (category_id, recipe_id) 
    );

#create index `idx_recipe_category_category_id` on `recipe_category` (`category_id`);
#create index `idx_recipe_category_recipe_id` on `recipe_category` (`recipe_id`);

create table
    if not exists `ingredient_group` (
        `ingredient_group_id` int auto_increment primary key,
        `recipe_id` int not null,
        `ingredient_group_order` int not null,
        `label` varchar(255) not null default '',
        `created_by` varchar(256) not null,
        `created_at` timestamp default current_timestamp,
        `updated_at` timestamp on update current_timestamp,
        `updated_by` varchar(256),
        foreign key (`recipe_id`) references `recipe` (`recipe_id`) on delete cascade,
        unique index `uidx_ingredient_group_ingredient_group_order_recipe_id` (`ingredient_group_order`, recipe_id)
    );

#create index `idx_step_recipe_id` on `ingredient_group` (`recipe_id`);

create table
    if not exists `ingredient` (
        `ingredient_id` int auto_increment primary key,
        `ingredient_group_id` int not null,
        `ingredient_order` int not null,
        `image_url` varchar(500),
        `label` varchar(255) not null,
        `created_by` varchar(256) not null,
        `created_at` timestamp default current_timestamp,
        `updated_at` timestamp on update current_timestamp,
        `updated_by` varchar(256),
        foreign key (`ingredient_group_id`) references `ingredient_group` (`ingredient_group_id`) on delete cascade,
        unique index `uidx_ingredient_ingredient_id_ingredient_order` (`ingredient_id`, `ingredient_order`)
    );

#create index `idx_ingredient_i_ingredient_group_id` on `ingredient` (`ingredient_group_id`);

create table
    if not exists `step_group` (
        `step_group_id` int auto_increment primary key,
        `step_group_order` int not null,
        `recipe_id` int not null,
        `label` varchar(255) not null default '',
        `created_by` varchar(256) not null,
        `created_at` timestamp default current_timestamp,
        `updated_at` timestamp on update current_timestamp,
        `updated_by` varchar(256),
        foreign key (`recipe_id`) references `recipe` (`recipe_id`) on delete cascade,
        unique index `uidx_step_group_step_group_order_recipe_id` (`step_group_order`, recipe_id)
    );

#create index `idx_step_recipe_id` on `step_group` (`recipe_id`);

create table
    if not exists `step` (
        `step_id` int auto_increment primary key,
        `step_group_id` int not null,
        `step_order` int not null,
        `description` text not null,
        `image_url` varchar(500),
        `created_by` varchar(256) not null,
        `created_at` timestamp default current_timestamp,
        `updated_at` timestamp on update current_timestamp,
        `updated_by` varchar(256),
        foreign key (`step_group_id`) references `step_group` (`step_group_id`) on delete cascade,
        unique index `uidx_step_step_id_step_order` (`step_id`, `step_order`)
    );

#create index `idx_step_step_group_id` on `step` (`step_group_id`);
