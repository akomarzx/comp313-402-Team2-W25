ALTER TABLE recipe
    MODIFY COLUMN summary VARCHAR(256);

CREATE INDEX idx_recipe_title ON recipe(title);
CREATE INDEX idx_recipe_summary ON recipe(summary);
CREATE INDEX idx_ingredient_label ON ingredient(label);
