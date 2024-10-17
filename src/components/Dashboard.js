import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [offers, setOffers] = useState([]);
  const [stats, setStats] = useState({
    totalOffers: 0,
    activeOffers: 0,
    completedOffers: 0
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching offers...');
      const response = await axios.get('/api/offers');
      console.log('Received offers:', response.data);
      if (Array.isArray(response.data)) {
        setOffers(response.data);
        updateStats(response.data);
      } else {
        console.error('Unexpected data format:', response.data);
        setError('Received unexpected data format from server');
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      setError(error.response?.data?.message || error.message || 'An error occurred while fetching offers');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (offersData) => {
    const stats = offersData.reduce((acc, offer) => {
      acc.totalOffers++;
      if (offer.status === 'Active') {
        acc.activeOffers++;
      } else {
        acc.completedOffers++;
      }
      return acc;
    }, { totalOffers: 0, activeOffers: 0, completedOffers: 0 });

    setStats(stats);
  };

  const handleEdit = (offerId) => {
    // Implement edit functionality
    console.log('Edit offer:', offerId);
  };

  const handleDelete = async (offerId) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await axios.delete(`/api/offers/${offerId}`);
        fetchOffers(); // Refresh the offers list
      } catch (error) {
        console.error('Error deleting offer:', error);
      }
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {loading && <p>Loading offers...</p>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>{stats.totalOffers}</h3>
              <p>Total Offers</p>
            </div>
            <div className="stat-card">
              <h3>{stats.activeOffers}</h3>
              <p>Active Offers</p>
            </div>
            <div className="stat-card">
              <h3>{stats.completedOffers}</h3>
              <p>Completed Offers</p>
            </div>
          </div>
          <h2>Recent Offers</h2>
          {offers.length === 0 ? (
            <p>No offers found. Try creating a new offer.</p>
          ) : (
            <div className="offers-grid">
              {offers.map(offer => (
                <div key={offer.id} className="offer-card">
                  <h3>{offer.name}</h3>
                  <p><strong>Client:</strong> {offer.clientName}</p>
                  <p><strong>CTA:</strong> {offer.ctaText}</p>
                  <p><strong>Start Date:</strong> {new Date(offer.startDate).toLocaleDateString()}</p>
                  <p><strong>End Date:</strong> {new Date(offer.endDate).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> <span className={`status-badge ${offer.status.toLowerCase()}`}>{offer.status}</span></p>
                  <div className="offer-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => handleEdit(offer.id)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(offer.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
