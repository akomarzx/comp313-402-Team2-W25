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
        400,
        'User Interaction Event Type',
        current_timestamp(),
        'sysadmin@mail.com',
        null,
        null
    );


insert into `code_value` (`code_value_id`, `code_book_id`, `label`, `created_at`, `created_by`, `updated_at`, `updated_by`)
values
    (400, 400, 'view', current_timestamp(), 'sysadmin@mail.com', null, null),
    (401, 400, 'saved', current_timestamp(), 'sysadmin@mail.com', null, null),
    (402, 400, 'unsaved', current_timestamp(), 'sysadmin@mail.com', null, null),
    (403, 400, 'comment', current_timestamp(), 'sysadmin@mail.com', null, null),
    (404, 400, 'rating', current_timestamp(), 'sysadmin@mail.com', null, null);

CREATE TABLE user_interaction (
               user_interaction_id int primary key AUTO_INCREMENT,
               created_by varchar(255) DEFAULT NULL,
               session_id varchar(255) DEFAULT NULL,
               recipe_id integer NOT NULL,
               user_interaction_event_type_code integer NOT NULL,
               foreign key (`user_interaction_event_type_code`) references `code_value` (`code_value_id`),
               foreign key (`recipe_id`) references `recipe` (`recipe_id`)
);

create index `idx_user_interaction_recipe_id` on `user_interaction` (`recipe_id`);
create index `idx_user_interaction_session_id` on `user_interaction` (`session_id`);
create index `idx_user_interaction_created_by` on `user_interaction` (`created_by`);
create index `idx_user_interaction_event_type_code` on `user_interaction` (`user_interaction_event_type_code`);
