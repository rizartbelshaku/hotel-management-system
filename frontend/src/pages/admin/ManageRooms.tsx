import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Hotel, Room } from '../../types';
import { hotelAPI, roomAPI } from '../../services/api';

const emptyForm = { hotelId: '', roomNumber: '', type: 'Single', price: '', available: true };

const ManageRooms = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    hotelAPI.getAll()
      .then(setHotels)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedHotel) {
      roomAPI.getByHotel(Number(selectedHotel))
        .then(setRooms)
        .catch((err) => setError(err.message));
    } else {
      setRooms([]);
    }
  }, [selectedHotel]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (editingId) {
        await roomAPI.update(editingId, {
          roomNumber: form.roomNumber,
          type: form.type,
          price: Number(form.price),
          available: form.available,
        });
        setMessage('Room updated');
      } else {
        await roomAPI.create({
          hotelId: Number(form.hotelId),
          roomNumber: form.roomNumber,
          type: form.type,
          price: Number(form.price),
          available: form.available,
        });
        setMessage('Room created');
        setSelectedHotel(form.hotelId);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      if (selectedHotel || form.hotelId) {
        roomAPI.getByHotel(Number(selectedHotel || form.hotelId)).then(setRooms);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const handleEdit = (room: Room) => {
    setForm({
      hotelId: String(room.hotel_id),
      roomNumber: room.room_number,
      type: room.type,
      price: String(room.price),
      available: room.available,
    });
    setEditingId(room.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this room?')) return;
    try {
      await roomAPI.delete(id);
      setMessage('Room deleted');
      if (selectedHotel) roomAPI.getByHotel(Number(selectedHotel)).then(setRooms);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Manage Rooms</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }} className="btn btn-primary">
          {showForm ? 'Cancel' : 'Add Room'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="form-group">
        <label>Select Hotel</label>
        <select value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)}>
          <option value="">-- Choose a hotel --</option>
          {hotels.map((h) => (
            <option key={h.id} value={h.id}>{h.name} ({h.city})</option>
          ))}
        </select>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <h3>{editingId ? 'Edit Room' : 'New Room'}</h3>
          {!editingId && (
            <div className="form-group">
              <label>Hotel</label>
              <select value={form.hotelId} onChange={(e) => setForm({ ...form, hotelId: e.target.value })} required>
                <option value="">-- Choose --</option>
                {hotels.map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="form-row">
            <div className="form-group">
              <label>Room Number</label>
              <input value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
                <option value="Deluxe">Deluxe</option>
              </select>
            </div>
            <div className="form-group">
              <label>Price/night</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="1" />
            </div>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} />
              {' '}Available
            </label>
          </div>
          <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'}</button>
        </form>
      )}

      {selectedHotel && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Room #</th>
                <th>Type</th>
                <th>Price</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id}>
                  <td>{r.room_number}</td>
                  <td>{r.type}</td>
                  <td className="table-cell-price">${r.price}</td>
                  <td>
                    <span className={`availability-badge ${r.available ? 'availability-yes' : 'availability-no'}`}>
                      {r.available ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="actions">
                    <button onClick={() => handleEdit(r)} className="btn btn-outline btn-sm">Edit</button>
                    <button onClick={() => handleDelete(r.id)} className="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageRooms;
