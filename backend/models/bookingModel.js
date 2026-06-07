const { pool } = require('../connect/database');

const findAll = async () => {
  const result = await pool.query(`
    SELECT b.*, u.name as user_name, u.email as user_email,
           h.name as hotel_name, r.room_number, r.type as room_type
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN hotels h ON b.hotel_id = h.id
    JOIN rooms r ON b.room_id = r.id
    ORDER BY b.created_at DESC
  `);
  return result.rows;
};

const findByUserId = async (userId) => {
  const result = await pool.query(`
    SELECT b.*, h.name as hotel_name, h.city, r.room_number, r.type as room_type
    FROM bookings b
    JOIN hotels h ON b.hotel_id = h.id
    JOIN rooms r ON b.room_id = r.id
    WHERE b.user_id = $1
    ORDER BY b.created_at DESC
  `, [userId]);
  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query(`
    SELECT b.*, h.name as hotel_name, r.room_number
    FROM bookings b
    JOIN hotels h ON b.hotel_id = h.id
    JOIN rooms r ON b.room_id = r.id
    WHERE b.id = $1
  `, [id]);
  return result.rows[0];
};

const create = async ({ userId, hotelId, roomId, checkInDate, checkOutDate, totalPrice }) => {
  const result = await pool.query(
    `INSERT INTO bookings (user_id, hotel_id, room_id, check_in_date, check_out_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'Pending') RETURNING *`,
    [userId, hotelId, roomId, checkInDate, checkOutDate, totalPrice]
  );
  return result.rows[0];
};

const updateStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query('DELETE FROM bookings WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};

const count = async () => {
  const result = await pool.query('SELECT COUNT(*) FROM bookings');
  return parseInt(result.rows[0].count, 10);
};

const findRecent = async (limit = 5) => {
  const result = await pool.query(`
    SELECT b.*, u.name as user_name, h.name as hotel_name, r.room_number
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN hotels h ON b.hotel_id = h.id
    JOIN rooms r ON b.room_id = r.id
    ORDER BY b.created_at DESC
    LIMIT $1
  `, [limit]);
  return result.rows;
};

module.exports = {
  findAll,
  findByUserId,
  findById,
  create,
  updateStatus,
  remove,
  count,
  findRecent,
};
