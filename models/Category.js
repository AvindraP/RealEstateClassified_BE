const Category = {
    table: "categories",

    schema: {
        name: {type: "string", optional: "false"},
        icon: {type: "string", optional: "false"},
        cat_order: {type: "number", optional: "false"},
    },
};

export default Category;
