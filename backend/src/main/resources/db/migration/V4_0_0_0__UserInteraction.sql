CREATE TABLE user_interaction (
               user_interaction_id int primary key AUTO_INCREMENT,
               user_id varchar(255) DEFAULT NULL,
               session_id varchar(255) DEFAULT NULL,
               recipe_id integer NOT NULL,
               event_type_code integer NOT NULL,
               foreign key (`event_type_code`) references `code_value` (`code_value_id`)
);

create index `idx_user_interaction_session_id` on `user_interaction` (`session_id`);
create index `idx_user_user_id` on `user_interaction` (`user_id`);
create index `idx_user_interaction_event_type_code` on `user_interaction` (`event_type_code`);
