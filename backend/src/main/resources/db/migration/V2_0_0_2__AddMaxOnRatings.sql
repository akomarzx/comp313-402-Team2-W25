alter table rating add constraint MIN_MAX_VALUE_RATING_RATING_VALUE check ( rating_value between 0.0 and 5.0);
alter table rating_calculated add constraint MIN_MAX_VALUE_RATING_CALCULATED_RATING_VALUE check ( rating_value between 0.0 and 5.0)
