const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is running successfully on Vercel Serverless!' });
});

// Lead capture endpoint
app.post('/api/leads', (req, res) => {
  const leadData = req.body;
  console.log('Received new lead:', leadData);
  // CRM / Database integration or email notification can be added here
  res.json({ success: true, message: 'Lead captured successfully', data: leadData });
});

// Listen locally if executed directly (e.g. npm run dev)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Backend API running on http://localhost:${port}`);
  });
}

module.exports = app;
