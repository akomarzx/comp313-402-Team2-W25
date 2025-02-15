ALTER TABLE recipe
    ADD FULLTEXT INDEX ft_index_title_summary (title, summary);

ALTER TABLE ingredient
    ADD FULLTEXT INDEX ft_index_label (label);
