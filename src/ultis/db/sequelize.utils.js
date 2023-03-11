const { Sequelize, DataTypes } = require("sequelize");

const customTypes = {
  id: () => ({
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: customTypes.unsignedInteger(),
  }),

  unsignedInteger: (int) => Sequelize.INTEGER(int).UNSIGNED,

  timestamp: (allowNull = false, defaultValue) => ({
    allowNull,
    type: Sequelize.DATE,
    defaultValue: defaultValue || Sequelize.NOW,
  }),

  reference(...args) {
    // table,
    // idCol = "id",
    // onUpdate = "CASCADE",
    // onDelete = "CASCADE",
    // allowNull = false
    const strArgs = args.filter((arg) => typeof arg === "string");
    const booleanArg = args.find((arg) => typeof arg === "boolean");

    return {
      type: customTypes.unsignedInteger(),
      references: {
        model: strArgs[0],
        key: strArgs[1] == null ? "id" : strArgs[1],
      },
      onUpdate: strArgs[2] == null ? "CASCADE" : strArgs[2],
      onDelete: strArgs[3] == null ? "CASCADE" : strArgs[3],
      allowNull: booleanArg == null ? false : booleanArg,
    };
  },
};

const beforeUpdate = (modelInstance) => {
  modelInstance.updatedAt = new Date();
};

const addPagination = (model) => {
  const tableName = model.tableName.toLowerCase();

  model.paginate = async (page = 1, size = 12, queryOptions, itemsKeyName) => {
    page = Math.floor(page);
    page = page < 1 ? 1 : page;

    size = Math.floor(size);
    size = size < 1 ? 1 : size;

    const offset = (page - 1) * size;
    const limit = Number(size);
    const result = await model.findAndCountAll({
      ...queryOptions,
      distinct: true,
      offset,
      limit,
    });
    const lastPage = Math.ceil(result.count / limit);

    return {
      currentPage: page,
      hasMorePages: page < lastPage,
      lastPage,
      total: result.count,
      maxItems: size,
      pageTotal: result.rows.length,
      [itemsKeyName || tableName]: result.rows,
    };
  };
};

const jsonComputedField = (name) => ({
  type: DataTypes.STRING,
  get() {
    return JSON.parse(this.getDataValue(name) || "{}");
  },
  set(obj) {
    this.setDataValue(name, JSON.stringify(obj || {}));
  },
});

module.exports = {
  customTypes,
  beforeUpdate,
  addPagination,
  jsonComputedField,
};
