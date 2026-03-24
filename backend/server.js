require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const requestIp = require('request-ip');
const UAParser = require('ua-parser-js');
const axios = require('axios');
const { connectDB, Link, Click } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

// Connect to MongoDB
connectDB().then(async () => {
  const count = await Link.countDocuments();
  if (count === 0) {
    console.log('Seeding initial MongoDB payload...');
    await Link.create([
      { id: nanoid(10), original_url: 'https://chanikya.netlify.app/', short_code: 'Chanikya', custom_alias: 'Chanikya' },
      { id: nanoid(10), original_url: 'https://youtube.com', short_code: 'ytest', custom_alias: 'ytest' },
      { id: nanoid(10), original_url: 'https://google.com', short_code: 'ggl', custom_alias: 'google' },
      { id: nanoid(10), original_url: 'https://github.com', short_code: 'ghub', custom_alias: null }
    ]);
    console.log('Sample links seeded successfully!');
  }
});

const ipCache = new Map();

async function logClick(req, linkId) {
  try {
    const ip = requestIp.getClientIp(req) || '127.0.0.1';
    
    const parser = new UAParser(req.headers['user-agent']);
    const browser = parser.getBrowser().name || 'Unknown';
    const os = parser.getOS().name || 'Unknown';
    const device = parser.getDevice().type || 'desktop';
    
    const referrer = req.headers.referer || req.headers.referrer || 'Direct';
    const hour = new Date().getHours();
    
    let country = 'Unknown';
    let city = 'Unknown';

    if (ipCache.has(ip)) {
      const cached = ipCache.get(ip);
      country = cached.country;
      city = cached.city;
    } else if (ip !== '127.0.0.1' && ip !== '::1') {
      try {
        const geo = await axios.get(`http://ip-api.com/json/${ip}`);
        if (geo.data && geo.data.status === 'success') {
          country = geo.data.country;
          city = geo.data.city;
          ipCache.set(ip, { country, city });
        }
      } catch (err) {
        console.error('Geo lookup failed', err.message);
      }
    }

    await Click.create({
      link_id: linkId, ip, country, city, device, browser, os, referrer, hour
    });
    
    await Link.updateOne({ id: linkId }, { $inc: { click_count: 1 } });
  } catch (error) {
    console.error('Error logging click:', error);
  }
}

const isValidUrl = (string) => {
  try { new URL(string); return true; } catch (_) { return false; }
};

// 1. POST /api/shorten
app.post('/api/shorten', async (req, res) => {
  let { url, customAlias, expiresIn, password } = req.body;

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL provided' });
  }

  let finalCode = '';
  if (customAlias) {
    if (!/^[a-zA-Z0-9-]+$/.test(customAlias)) {
      return res.status(400).json({ error: 'Custom alias can only contain alphanumeric characters and hyphens' });
    }
    const existing = await Link.findOne({ $or: [{ short_code: customAlias }, { custom_alias: customAlias }] });
    if (existing) {
      return res.status(409).json({ error: 'Custom alias is already in use' });
    }
    finalCode = customAlias;
  } else {
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 10) {
      finalCode = nanoid(6);
      const existing = await Link.findOne({ short_code: finalCode });
      if (!existing) isUnique = true;
      attempts++;
    }
    if (!isUnique) return res.status(500).json({ error: 'Failed to generate unique code.' });
  }

  const id = nanoid(10);
  
  try {
    await Link.create({
      id,
      original_url: url,
      short_code: finalCode,
      custom_alias: customAlias || null,
      expires_at: expiresIn ? new Date(expiresIn) : null,
      password: password || null
    });
    
    const shortUrl = `${BACKEND_URL}/${finalCode}`;
    res.json({ shortUrl, shortCode: finalCode, qrCodeData: shortUrl });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// 2. GET /api/links
app.get('/api/links', async (req, res) => {
  try {
    const links = await Link.find().sort({ created_at: -1 });
    const safeLinks = links.map(l => ({
      id: l.id,
      original_url: l.original_url,
      short_code: l.short_code,
      custom_alias: l.custom_alias,
      created_at: l.created_at,
      expires_at: l.expires_at,
      click_count: l.click_count,
      is_active: l.is_active,
      hasPassword: !!l.password
    }));
    res.json(safeLinks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2a. PUT /api/links/:id
app.put('/api/links/:id', async (req, res) => {
  const { customAlias, is_active } = req.body;
  try {
    if (customAlias) {
      const existing = await Link.findOne({ 
        $or: [{ custom_alias: customAlias }, { short_code: customAlias }],
        id: { $ne: req.params.id }
      });
      if (existing) return res.status(409).json({ error: 'Alias in use' });
    }
    
    await Link.updateOne({ id: req.params.id }, {
      $set: {
        custom_alias: customAlias || null,
        is_active: is_active ? 1 : 0
      }
    });
    res.json({ success: true });
  } catch(e) { 
    res.status(500).json({error: e.message}); 
  }
});

// 2b. DELETE /api/links/:id
app.delete('/api/links/:id', async (req, res) => {
  try {
    await Link.deleteOne({ id: req.params.id });
    await Click.deleteMany({ link_id: req.params.id });
    res.json({ success: true });
  } catch(e) { 
    res.status(500).json({error: e.message}); 
  }
});

// 3. POST /api/verify-password
const passwordAttempts = new Map();
app.post('/api/verify-password', async (req, res) => {
  const { code, password } = req.body;
  const ip = requestIp.getClientIp(req) || '127.0.0.1';
  
  const attemptKey = `${ip}:${code}`;
  const attempts = passwordAttempts.get(attemptKey) || 0;
  
  if (attempts >= 5) return res.status(429).json({ error: 'Too many failed attempts.' });
  if (!code || !password) return res.status(400).json({ error: 'Missing code/password' });

  const link = await Link.findOne({ $or: [{ short_code: code }, { custom_alias: code }] });
  if (!link) return res.status(404).json({ error: 'Link not found' });
  
  if (link.password !== password) {
    passwordAttempts.set(attemptKey, attempts + 1);
    return res.status(401).json({ error: 'Incorrect password' });
  }

  passwordAttempts.delete(attemptKey);
  res.json({ original_url: link.original_url });
});

// 4. GET /api/analytics/:code
app.get('/api/analytics/:code', async (req, res) => {
  const code = req.params.code;
  const { days } = req.query;

  try {
    const link = await Link.findOne({ $or: [{ short_code: code }, { custom_alias: code }] });
    if (!link) return res.status(404).json({ error: 'Link not found' });

    let matchStage = { link_id: link.id };
    if (days && days !== 'all') {
      const d = new Date();
      d.setDate(d.getDate() - parseInt(days));
      matchStage.clicked_at = { $gte: d };
    }

    const totalClicks = await Click.countDocuments(matchStage);
    
    // Unique countries
    const distinctCountries = await Click.distinct('country', { ...matchStage, country: { $ne: 'Unknown' } });
    const uniqueCountries = distinctCountries.length;

    // Helper for grouping
    const getTopList = async (field, limit = 10) => {
      const agg = await Click.aggregate([
        { $match: matchStage },
        { $group: { _id: `$${field}`, clicks: { $sum: 1 } } },
        { $sort: { clicks: -1 } },
        { $limit: limit }
      ]);
      return agg.map(r => ({ [field]: r._id || 'Unknown', clicks: r.clicks }));
    };

    const topReferrersList = await getTopList('referrer', 5);
    const topReferrer = topReferrersList.length > 0 ? topReferrersList[0].referrer : 'None';
    
    const topDevicesList = await getTopList('device', 5);
    const topDevice = topDevicesList.length > 0 ? topDevicesList[0].device : 'None';

    const clicksByCountry = await getTopList('country', 10);
    const clicksByDevice = topDevicesList;
    const clicksByBrowser = await getTopList('browser', 10);
    const clicksByReferrer = topReferrersList;

    // By Day
    const byDay = await Click.aggregate([
      { $match: matchStage },
      { $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$clicked_at" } }, 
          clicks: { $sum: 1 } 
      } },
      { $sort: { _id: 1 } }
    ]);
    const clicksByDay = byDay.map(r => ({ date: r._id, clicks: r.clicks }));

    // By Hour
    const byHour = await Click.aggregate([
      { $match: matchStage },
      { $group: {
          _id: { dayOfWeek: { $dayOfWeek: "$clicked_at" }, hour: "$hour" },
          clicks: { $sum: 1 }
      } }
    ]);
    // MongoDB $dayOfWeek is 1=Sun. We want 0=Sun.
    const clicksByHour = byHour.map(r => ({ 
      dayOfWeek: r._id.dayOfWeek - 1, 
      hour: r._id.hour, 
      clicks: r.clicks 
    }));

    res.json({
      totalClicks, uniqueCountries, topReferrer, topDevice,
      clicksByDay, clicksByHour, clicksByCountry, clicksByDevice, clicksByBrowser, clicksByReferrer
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. GET /:code (Redirect Endpoint)
app.get('/:code', async (req, res) => {
  if (req.params.code === 'favicon.ico') return res.status(204).end();
  
  const code = req.params.code;
  const link = await Link.findOne({ $or: [{ short_code: code }, { custom_alias: code }] });
  
  if (!link) return res.status(404).send('Link not found');
  if (link.is_active === 0) return res.status(403).send('This link has been deactivated.');
  if (link.expires_at && new Date() > link.expires_at) return res.redirect(`${FRONTEND_URL}/expired`);
  if (link.password) return res.redirect(`${FRONTEND_URL}/protected/${code}`);

  logClick(req, link.id); // async
  res.redirect(301, link.original_url);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
