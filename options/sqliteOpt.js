const options = {
  client: "sqlite3",
  connection: {
    filename: "./data/midb.sqlite",
  },
  useNullAsDefault: true,
};

module.exports = options;
