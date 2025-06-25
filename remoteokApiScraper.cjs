const express = require('express');
const axios = require('axios');

const app = express();
const port = 3001;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/scrape', async (req, res) => {
  try {
    const response = await axios.get('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    // The first element is an API guide, skip it
    const jobs = response.data.slice(1).map(job => ({
      title: job.position || job.title || '',
      company: job.company || '',
      job_type: (job.tags || []).join(', '),
      location: job.location || 'Remote',
      application_url: job.url ? `https://remoteok.com${job.url}` : '',
      contact_email: job.email || null,
      scraped_at: new Date().toISOString()
    }));
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs from RemoteOK API:', error);
    res.status(500).json({ error: 'Failed to fetch jobs', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`API-based scraper server listening at http://localhost:${port}`);
});
