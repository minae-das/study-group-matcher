const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3003;

// In-memory stores
let groups = [];
let members = [];
let events = [];

app.use(express.static(path.join(__dirname, 'public')));

// Groups
app.get('/api/groups', (req, res) => res.json(groups));
app.post('/api/groups', (req, res) => {
  const { name, subject, description } = req.body;
  if (!name || !subject) return res.status(400).json({ error: 'name and subject required' });
  const group = { id: Date.now().toString(), name, subject, description: description||'', createdAt: new Date().toISOString() };
  groups.push(group);
  res.status(201).json(group);
});

// Members (simple list)
app.get('/api/members', (req, res) => res.json(members));
app.post('/api/members', (req, res) => {
  const { name, email } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const member = { id: Date.now().toString(), name, email: email||'' };
  members.push(member);
  res.status(201).json(member);
});

// Events (meetings)
app.get('/api/events', (req, res) => res.json(events));
app.post('/api/events', (req, res) => {
  const { groupId, title, time, location } = req.body;
  if (!groupId || !title || !time) return res.status(400).json({ error: 'groupId, title and time required' });
  const ev = { id: Date.now().toString(), groupId, title, time, location: location||'', createdAt: new Date().toISOString() };
  events.push(ev);
  res.status(201).json(ev);
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Study Group Matcher listening on http://localhost:${PORT}`));
