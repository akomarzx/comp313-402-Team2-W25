create table if not exists `code_book` (
                                           code_book_id bigint primary key,
                                           label varchar(255) not null,
                                           created_at timestamp default current_timestamp(),
                                           created_by varchar(255) not null,
                                           updated_at timestamp,
                                           updated_by varchar(255)
)ENGINE=INNODB;

insert into code_book (code_book_id, label, created_at, created_by, updated_at, updated_by) values (10000, 'TimeUnit', current_timestamp(), 'System', null, null);

create table if not exists `code_value` (
                                            code_value_id bigint primary key,
                                            code_book_id bigint not null,
                                            label varchar(255) not null,
                                            created_at timestamp not null,
                                            created_by varchar(255) not null,
                                            updated_at timestamp,
                                            updated_by varchar(255),
                                            foreign key (code_book_id)
                                                references code_book (code_book_id)
                                                on update restrict
                                                on delete cascade
) ENGINE=INNODB;

create index code_value_code_book_id_idx on code_value (code_book_id);

create table if not exists `category` (
                                          category_id bigint auto_increment primary key,
                                          label varchar(255) not null,
                                          created_at timestamp not null default current_timestamp(),
                                          created_by varchar(255) not null,
                                          updated_at timestamp,
                                          updated_by varchar(255)
) ENGINE=INNODB;

create table if not exists `recipe` (
                                          recipe_id bigint auto_increment primary key,
                                          label varchar(255) not null,
                                          summary varchar(500) not null,
                                          created_at timestamp not null default current_timestamp(),
                                          created_by varchar(255) not null,
                                          updated_at timestamp,
                                          updated_by varchar(255)
) ENGINE=INNODB;

create table if not exists `recipe` (
                                        recipe_id bigint auto_increment primary key,
                                        label varchar(255) not null,
                                        summary varchar(500) not null,
                                        created_at timestamp not null default current_timestamp(),
                                        created_by varchar(255) not null,
                                        updated_at timestamp,
                                        updated_by varchar(255)
) ENGINE=INNODB;

create table if not exists `ingredient` (
                                        ingredient_id bigint auto_increment primary key,
                                        label varchar(255) not null,
                                        ingredient_image_url varchar(255),
                                        created_at timestamp not null default current_timestamp(),
                                        created_by varchar(255) not null,
                                        updated_at timestamp,
                                        updated_by varchar(255)
) ENGINE=INNODB;