alter table rating_calculated drop index rating_calculated_recipe_id_idx;
ALTER TABLE rating_calculated  DROP FOREIGN KEY rating_calculated_ibfk_1;
ALTER TABLE rating_calculated DROP PRIMARY KEY;

alter table rating_calculated add column `rating_calculated_id` int primary KEY AUTO_INCREMENT;
ALTER TABLE rating_calculated ADD CONSTRAINT FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id);
ALTER TABLE `rating_calculated` ADD INDEX `rating_calculated_recipe_id_idx` (recipe_id)