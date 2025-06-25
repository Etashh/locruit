const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');

const app = express();
const port = 3002; // Use a different port to avoid conflicts

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Example: Front-End jobs RSS feed from WeWorkRemotely
const WWR_FEED_URL = 'https://weworkremotely.com/categories/remote-front-end-programming-jobs.rss';

app.get('/scrape', async (req, res) => {
  try {
    const response = await axios.get(WWR_FEED_URL);
    const xml = response.data;
    xml2js.parseString(xml, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to parse RSS feed', details: err.message });
      }
      const items = result.rss.channel[0].item || [];
      const jobs = items.map(item => ({
        title: item.title[0],
        company: item['weworkremotely:company'] ? item['weworkremotely:company'][0] : '',
        job_type: item.category ? item.category.join(', ') : '',
        location: item['weworkremotely:region'] ? item['weworkremotely:region'][0] : 'Remote',
        application_url: item.link[0],
        contact_email: null, // Not provided in RSS
        scraped_at: new Date().toISOString()
      }));
      res.json(jobs);
    });
  } catch (error) {
    console.error('Error fetching jobs from WeWorkRemotely RSS:', error);
    res.status(500).json({ error: 'Failed to fetch jobs', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`WeWorkRemotely RSS scraper server listening at http://localhost:${port}`);
});
