import React, { useState } from 'react';
import axios from 'axios';

function CreateOffer() {
  const [offerData, setOfferData] = useState({
    name: '',
    clientName: '',
    ctaText: '',
    startDate: '',
    endDate: '',
    redirectUrl: '',
    backgroundImageUrl: '',
    clientLogoUrl: '',
    textLine1: '',
    textLine2: '',
    textLine3: ''
  });

  const handleChange = (e) => {
    setOfferData({ ...offerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/offers', offerData);
      console.log('Server response:', response.data); // Add this line for debugging
      if (response.data.success) {
        alert('Offer created successfully!');
        // Reset form
        setOfferData({
          name: '',
          clientName: '',
          ctaText: '',
          startDate: '',
          endDate: '',
          redirectUrl: '',
          backgroundImageUrl: '',
          clientLogoUrl: '',
          textLine1: '',
          textLine2: '',
          textLine3: ''
        });
      } else {
        alert('Failed to create offer: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error creating offer:', error);
      alert('Failed to create offer: ' + error.message);
    }
  };

  return (
    <div className="card">
      <h1>Create New Offer</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Offer Name</label>
          <input id="name" name="name" value={offerData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="clientName">Client Name</label>
          <input id="clientName" name="clientName" value={offerData.clientName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="ctaText">CTA Text</label>
          <input id="ctaText" name="ctaText" value={offerData.ctaText} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input type="date" id="startDate" name="startDate" value={offerData.startDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input type="date" id="endDate" name="endDate" value={offerData.endDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="redirectUrl">Redirect URL</label>
          <input id="redirectUrl" name="redirectUrl" value={offerData.redirectUrl} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="backgroundImageUrl">Background Image URL</label>
          <input id="backgroundImageUrl" name="backgroundImageUrl" value={offerData.backgroundImageUrl} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="clientLogoUrl">Client Logo URL</label>
          <input id="clientLogoUrl" name="clientLogoUrl" value={offerData.clientLogoUrl} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="textLine1">Text Line 1</label>
          <input id="textLine1" name="textLine1" value={offerData.textLine1} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="textLine2">Text Line 2</label>
          <input id="textLine2" name="textLine2" value={offerData.textLine2} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="textLine3">Text Line 3</label>
          <input id="textLine3" name="textLine3" value={offerData.textLine3} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Create Offer</button>
      </form>
    </div>
  );
}

export default CreateOffer;
