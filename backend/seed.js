require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool, initDB } = require('./connect/database');

const seed = async () => {
  await initDB();

  const adminEmail = 'admin@hotel.com';
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);

  if (existing.rows.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
      ['Admin', adminEmail, hashedPassword, 'admin']
    );
    console.log('Admin user created: admin@hotel.com / admin123');
  } else {
    console.log('Admin user already exists');
  }

  const hotelCount = await pool.query('SELECT COUNT(*) FROM hotels');
  if (parseInt(hotelCount.rows[0].count, 10) === 0) {
    const hotel = await pool.query(
      `INSERT INTO hotels (name, city, address, description, image)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [
        'Luxury Hotel',
        'Tirane',
        'Rruga e Dibrës 123',
        'Hotel modern në qendër të Tiranës me pamje të mrekullueshme.',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      ]
    );

    await pool.query(
      `INSERT INTO rooms (hotel_id, room_number, type, price, available) VALUES
       ($1, '101', 'Single', 50, true),
       ($1, '102', 'Double', 80, true),
       ($1, '201', 'Suite', 150, true)`,
      [hotel.rows[0].id]
    );
    console.log('Sample hotel and rooms created');
  }

  await pool.end();
  console.log('Seed completed');
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
