exports.up = function(knex, Promise) {
    return knex.schema
        .createTable("users", tbl => {
            tbl.increments();
            tbl.text("name").notNullable();
            tbl.text("email").notNullable();
            tbl.text("stripe");
            tbl.text("country").defaultTo("");
            tbl.boolean("is_admin").nullable().defaultTo(false);
            tbl.boolean("is_manager").nullable().defaultTo(false);
            tbl
                .integer("notifications_sent")
                .notNullable()
                .defaultTo(0);
        })
        .createTable("organizations", tbl => {
            tbl.increments();
            tbl.text("name").notNullable();
            tbl
                .integer("user_id")
                .references("id")
                .inTable("users")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
                .notNullable();
        })
        .createTable("services", tbl => {
            tbl.increments();
            tbl.text("name").notNullable();
        })
        .createTable("tokens", tbl => {
            tbl.increments();
            tbl.dateTime("expiration");
            tbl.text("auth_token").notNullable();
            tbl.text("refresh_token");
            tbl
                .integer("service_id")
                .references("id")
                .inTable("services")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
                .notNullable();
            tbl
                .integer("user_id")
                .references("id")
                .inTable("users")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
                .notNullable();
        })
        .createTable("classes", tbl =>{
            tbl.increments();
            tbl.text("title").notNullable();
            tbl
                .integer("user_id")
                .references("id")
                .inTable("users")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
                .notNullable();
        })
        .createTable("class_members", tbl => {
            tbl.increments();
            tbl.text("first_name").notNullable();
            tbl.text("last_name").notNullable();
            tbl.text("email");
            tbl.text("phone_number");
            tbl.text("slack_uuid");
            tbl
                .integer("user_id")
                .references("id")
                .inTable("users")
                .onDelete("CASCADE")
                .onUpdate("CASCADE");
            tbl
                .integer("class_id")
                .references("id")
                .inTable("classes")
                .onDelete("CASCADE")
                .onUpdate("CASCADE");
        })
        .createTable("training_series", tbl => {
            tbl.increments();
            tbl.text("title").notNullable();
            tbl.text("country").notNullable();
            tbl
                .integer("user_id")
                .references("id")
                .inTable("users")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
                .notNullable();
        })
        .createTable("messages", tbl => {
            tbl.increments();
            tbl.text("subject").notNullable();
            tbl.text("body").notNullable();
            tbl.text("link");
            tbl.integer("days_from_start").notNullable();
            tbl.integer("status").notNullable();
            tbl
                .integer("training_series_id")
                .references("id")
                .inTable("training_series")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
                .notNullable();
            tbl
                .boolean("for_manager")
                .notNullable()
                .defaultTo(false);
            tbl
                .boolean("for_class")
                .notNullable()
                .defaultTo(false);
            tbl
                .boolean("for_class_member")
                .notNullable()
                .defaultTo(false);
        })
        .createTable("notifications", tbl => {
            tbl.increments();
            tbl.dateTime("send_date").notNullable();
            tbl
                .boolean("is_sent")
                .notNullable()
                .defaultTo(false);
            tbl
                .integer("num_attempts")
                .notNullable()
                .defaultTo(0);
            tbl.text("thread");
            tbl
                .integer("user_id")
                .references("id")
                .inTable("users")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
                .notNullable();
            tbl
                .integer("service_id")
                .references("id")
                .inTable("services")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
                .notNullable();
            tbl
                .integer("class_member_id")
                .references("id")
                .inTable("class_members")
                .onDelete("CASCADE")
                .onUpdate("CASCADE");
            tbl
                .integer("class_id")
                .references("id")
                .inTable("classes")
                .onDelete("CASCADE")
                .onUpdate("CASCADE");
        })
        .createTable("responses", tbl => {
            tbl.increments();
            tbl.text("body");
            tbl
                .integer("notification_id")
                .references("id")
                .inTable("notifications")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
                .notNullable();
            tbl
                .timestamp("created_at")
                .notNullable()
                .defaultTo(knex.fn.now());
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTableIfExists("responses")
        .dropTableIfExists("notifications")
        .dropTableIfExists("messages")
        .dropTableIfExists("training_series")
        .dropTableIfExists("class_members")
        .dropTableIfExists("classes")
        .dropTableIfExists("tokens")
        .dropTableIfExists("services")
        .dropTableIfExists("organizations")
        .dropTableIfExists("users")
};