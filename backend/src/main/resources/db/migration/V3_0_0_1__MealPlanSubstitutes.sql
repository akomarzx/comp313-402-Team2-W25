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
        300,
        'Non Recipe Substitution',
        current_timestamp(),
        'sysadmin@mail.com',
        null,
        null
    );


insert into `code_value` (`code_value_id`, `code_book_id`, `label`, `created_at`, `created_by`, `updated_at`, `updated_by`)
values
    (300, 300, 'Leftovers', current_timestamp(), 'sysadmin@mail.com', null, null),
    (301, 300, 'Takeout/Eat-out', current_timestamp(), 'sysadmin@mail.com', null, null),
    (302, 300, 'Build Your Own', current_timestamp(), 'sysadmin@mail.com', null, null);

ALTER TABLE `meal_plan_days` RENAME COLUMN `breakfast_recipe_substitute` to `breakfast_recipe_substitute_cd`;
ALTER TABLE `meal_plan_days` RENAME COLUMN `lunch_recipe_substitute` to `lunch_recipe_substitute_cd`;
ALTER TABLE `meal_plan_days` RENAME COLUMN `dinner_recipe_substitute` to `dinner_recipe_substitute_cd`;

alter table `meal_plan_days` modify `breakfast_recipe_substitute_cd` int;
alter table `meal_plan_days` modify `lunch_recipe_substitute_cd` int;
alter table `meal_plan_days` modify `dinner_recipe_substitute_cd` int;

ALTER TABLE `meal_plan_days` ADD CONSTRAINT FOREIGN KEY (`breakfast_recipe_substitute_cd`) REFERENCES code_value(code_value_id);
ALTER TABLE `meal_plan_days` ADD CONSTRAINT FOREIGN KEY (`lunch_recipe_substitute_cd`) REFERENCES code_value(code_value_id);
ALTER TABLE `meal_plan_days` ADD CONSTRAINT FOREIGN KEY (`dinner_recipe_substitute_cd`) REFERENCES code_value(code_value_id);

create index `meal_plan_days_breakfast_recipe_substitute_cd_idx` on `meal_plan_days` (`breakfast_recipe_substitute_cd`);
create index `meal_plan_days_lunch_recipe_substitute_cd_idx` on `meal_plan_days` (`lunch_recipe_substitute_cd`);
create index `meal_plan_days_dinner_recipe_substitute_cd_idx` on `meal_plan_days` (`dinner_recipe_substitute_cd`);
