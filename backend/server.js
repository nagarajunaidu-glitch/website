const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is running successfully!' });
});

// Example lead capture endpoint (to connect with frontend form later)
app.post('/api/leads', (req, res) => {
  const leadData = req.body;
  console.log('Received new lead:', leadData);
  // Here you would typically save to a database or CRM
  res.json({ success: true, message: 'Lead captured successfully', data: leadData });
});

app.listen(port, () => {
  console.log(`🚀 Backend API running on http://localhost:${port}`);
});
