import React, { useState } from 'react';

const getSkillsFromProfile = () => {
  // Replace with your actual logic to get user skills
  return ['python', 'react'];
};

const ExternalJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = (lat, lon, zip, skills) => {
    setLoading(true);
    setError(null);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    let url = `${apiUrl}/scrape?`;
    if (lat && lon) {
      url += `lat=${lat}&lon=${lon}`;
    } else if (zip) {
      url += `zip=${zip}`;
    }
    if (skills) {
      url += `&skills=${encodeURIComponent(skills.join(','))}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const skills = getSkillsFromProfile();
          fetchJobs(lat, lon, null, skills);
        },
        (err) => {
          setError('Location access denied. Please enter your zip code.');
        }
      );
    } else {
      setError('Geolocation is not supported. Please enter your zip code.');
    }
  };

  const handleZipSubmit = (e) => {
    e.preventDefault();
    const zip = e.target.zip.value;
    const skills = getSkillsFromProfile();
    fetchJobs(null, null, zip, skills);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Jobs Near You</h1>
      <button onClick={handleLocation} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Use My Location
      </button>
      <form onSubmit={handleZipSubmit} className="mb-4">
        <input
          name="zip"
          placeholder="Enter your pin/zip code"
          className="border px-2 py-1 mr-2"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Search by Zip
        </button>
      </form>
      {loading && <div>Loading jobs...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {jobs.length === 0 && !loading && !error && <div>No jobs found.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, idx) => (
          <div key={idx} className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-600">{job.company}</p>
            <p className="text-sm text-gray-500">{job.location}</p>
            <p className="text-sm text-gray-500">{job.description?.slice(0, 120)}...</p>
            <a
              href={job.redirect_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-4 inline-block"
            >
              Apply Now
            </a>
            {job.salary_min && (
              <div className="text-green-700 mt-2">
                Salary: {job.salary_min} - {job.salary_max}
              </div>
            )}
            {job.contact_email && (
              <div className="mt-2 text-sm text-green-700">Contact: {job.contact_email}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExternalJobs;