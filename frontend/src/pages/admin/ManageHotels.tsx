import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Hotel } from '../../types';
import { hotelAPI } from '../../services/api';

const emptyForm = { name: '', city: '', address: '', description: '', image: '' };

const ManageHotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchHotels = () => {
    hotelAPI.getAll()
      .then(setHotels)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchHotels(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (editingId) {
        await hotelAPI.update(editingId, form);
        setMessage('Hotel updated successfully');
      } else {
        await hotelAPI.create(form);
        setMessage('Hotel created successfully');
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchHotels();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const handleEdit = (hotel: Hotel) => {
    setForm({
      name: hotel.name,
      city: hotel.city,
      address: hotel.address,
      description: hotel.description || '',
      image: hotel.image || '',
    });
    setEditingId(hotel.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this hotel and all its rooms?')) return;
    try {
      await hotelAPI.delete(id);
      setMessage('Hotel deleted');
      fetchHotels();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Manage Hotels</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }} className="btn btn-primary">
          {showForm ? 'Cancel' : 'Add Hotel'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <h3>{editingId ? 'Edit Hotel' : 'New Hotel'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>City</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'}</button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((h) => (
              <tr key={h.id}>
                <td>{h.name}</td>
                <td>{h.city}</td>
                <td>{h.address}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(h)} className="btn btn-outline btn-sm">Edit</button>
                  <button onClick={() => handleDelete(h.id)} className="btn btn-danger btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageHotels;
