const { pool } = require('../connect/database');

const findByHotelId = async (hotelId) => {
  const result = await pool.query(
    'SELECT * FROM rooms WHERE hotel_id = $1 ORDER BY room_number',
    [hotelId]
  );
  return result.rows;
};

const findAvailableByHotelId = async (hotelId) => {
  const result = await pool.query(
    'SELECT * FROM rooms WHERE hotel_id = $1 AND available = true ORDER BY room_number',
    [hotelId]
  );
  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
  return result.rows[0];
};

const create = async ({ hotelId, roomNumber, type, price, available = true }) => {
  const result = await pool.query(
    `INSERT INTO rooms (hotel_id, room_number, type, price, available)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [hotelId, roomNumber, type, price, available]
  );
  return result.rows[0];
};

const update = async (id, { roomNumber, type, price, available }) => {
  const result = await pool.query(
    `UPDATE rooms SET room_number = $1, type = $2, price = $3, available = $4, updated_at = CURRENT_TIMESTAMP
     WHERE id = $5 RETURNING *`,
    [roomNumber, type, price, available, id]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query('DELETE FROM rooms WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};

const count = async () => {
  const result = await pool.query('SELECT COUNT(*) FROM rooms');
  return parseInt(result.rows[0].count, 10);
};

module.exports = {
  findByHotelId,
  findAvailableByHotelId,
  findById,
  create,
  update,
  remove,
  count,
};
