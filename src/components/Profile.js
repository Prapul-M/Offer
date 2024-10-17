import React, { useState } from 'react';

function Profile() {
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Marketing Manager',
    company: 'Acme Inc.',
    bio: 'Passionate about creating engaging marketing campaigns and driving customer growth.'
  });

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the updated profile data to your backend
    console.log('Updated profile:', profileData);
    alert('Profile updated successfully!');
  };

  return (
    <div>
      <div className="profile-header">
        <img src="https://via.placeholder.com/100" alt="Profile" className="profile-avatar" />
        <div className="profile-info">
          <h2>{profileData.name}</h2>
          <p>{profileData.role} at {profileData.company}</p>
        </div>
      </div>
      <div className="card">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" value={profileData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={profileData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <input id="role" name="role" value={profileData.role} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input id="company" name="company" value={profileData.company} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" name="bio" value={profileData.bio} onChange={handleChange} rows="4"></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Update Profile</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
