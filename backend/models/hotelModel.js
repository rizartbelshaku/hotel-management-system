const { pool } = require('../connect/database');

const findAll = async () => {
  const result = await pool.query('SELECT * FROM hotels ORDER BY created_at DESC');
  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM hotels WHERE id = $1', [id]);
  return result.rows[0];
};

const create = async ({ name, city, address, description, image }) => {
  const result = await pool.query(
    `INSERT INTO hotels (name, city, address, description, image)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, city, address, description, image]
  );
  return result.rows[0];
};

const update = async (id, { name, city, address, description, image }) => {
  const result = await pool.query(
    `UPDATE hotels SET name = $1, city = $2, address = $3, description = $4, image = $5, updated_at = CURRENT_TIMESTAMP
     WHERE id = $6 RETURNING *`,
    [name, city, address, description, image, id]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query('DELETE FROM hotels WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};

const count = async () => {
  const result = await pool.query('SELECT COUNT(*) FROM hotels');
  return parseInt(result.rows[0].count, 10);
};

module.exports = { findAll, findById, create, update, remove, count };
