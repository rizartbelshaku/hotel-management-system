const asyncHandler = require('express-async-handler');
const Hotel = require('../models/hotelModel');

const getHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.findAll();
  res.json(hotels);
});

const getHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    res.status(404);
    throw new Error('Hotel not found');
  }
  res.json(hotel);
});

const createHotel = asyncHandler(async (req, res) => {
  const { name, city, address, description, image } = req.body;

  if (!name || !city || !address) {
    res.status(400);
    throw new Error('Name, city and address are required');
  }

  const hotel = await Hotel.create({ name, city, address, description, image });
  res.status(201).json(hotel);
});

const updateHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    res.status(404);
    throw new Error('Hotel not found');
  }

  const updated = await Hotel.update(req.params.id, {
    name: req.body.name ?? hotel.name,
    city: req.body.city ?? hotel.city,
    address: req.body.address ?? hotel.address,
    description: req.body.description ?? hotel.description,
    image: req.body.image ?? hotel.image,
  });
  res.json(updated);
});

const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    res.status(404);
    throw new Error('Hotel not found');
  }

  await Hotel.remove(req.params.id);
  res.json({ id: req.params.id, message: 'Hotel deleted' });
});

module.exports = { getHotels, getHotel, createHotel, updateHotel, deleteHotel };
