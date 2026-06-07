const asyncHandler = require('express-async-handler');
const Room = require('../models/roomModel');
const Hotel = require('../models/hotelModel');

const getRoomsByHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.hotelId);
  if (!hotel) {
    res.status(404);
    throw new Error('Hotel not found');
  }

  const rooms = req.query.available === 'true'
    ? await Room.findAvailableByHotelId(req.params.hotelId)
    : await Room.findByHotelId(req.params.hotelId);

  res.json(rooms);
});

const getRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }
  res.json(room);
});

const createRoom = asyncHandler(async (req, res) => {
  const { hotelId, roomNumber, type, price, available } = req.body;

  if (!hotelId || !roomNumber || !type || !price) {
    res.status(400);
    throw new Error('Hotel, room number, type and price are required');
  }

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    res.status(404);
    throw new Error('Hotel not found');
  }

  const room = await Room.create({
    hotelId,
    roomNumber,
    type,
    price,
    available: available !== undefined ? available : true,
  });
  res.status(201).json(room);
});

const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  const updated = await Room.update(req.params.id, {
    roomNumber: req.body.roomNumber ?? room.room_number,
    type: req.body.type ?? room.type,
    price: req.body.price ?? room.price,
    available: req.body.available !== undefined ? req.body.available : room.available,
  });
  res.json(updated);
});

const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  await Room.remove(req.params.id);
  res.json({ id: req.params.id, message: 'Room deleted' });
});

module.exports = { getRoomsByHotel, getRoom, createRoom, updateRoom, deleteRoom };
