const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const xml2js = require('xml2js');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'http://localhost:8012',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type, Authorization'
};
app.use(cors(corsOptions));

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pr@gy@1234',
  database: 'employee'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Routes
app.get('/api/employee', (req, res) => {
  db.query('SELECT id, name, pid FROM employee', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query error' });
      return;
    }
    res.json(results);
  });
});

app.post('/employee', (req, res) => {
  const { id, name, pid } = req.body;

  // Log incoming data
  console.log(`Incoming data: id=${id}, name=${name}, pid=${pid}`);

  db.query('INSERT INTO employee (id, name, pid) VALUES (?, ?, ?)', [id, name, pid], (err, result) => {
    if (err) {
      // Log error details
      console.error('Database insert error:', err); 
      res.status(500).json({ error: 'Database insert error', details: err.message });
      return;
    }
    res.json({ message: 'Employee added' });
  });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/result.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/result.html'));
});

app.get('/result_new.html', (req, res)=>{
  res.sendFile(path.join(__dirname, 'public/result_new.html'));
});

app.post('/employee', (req, res) => {
  const { id, name, pid } = req.body;
  if (!id || !name) {
    return res.status(400).send('ID and name are required');
  }
  const existingIndex = employee.findIndex(e => e.id === id);
  if (existingIndex !== -1) {
    employee[existingIndex] = { id, name, pid };
  } else {
    employee.push({ id, name, pid });
  }
  res.status(201).json({ id, name, pid });
});

// Fetch all employees
app.get('/api/employee', (req, res) => {
  db.query('SELECT id, name, pid FROM employee', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query error' });
      return;
    }
    res.json(results);
  });
});

// Update an employee
app.put('/api/employee/:id', (req, res) => {
  const { name, pid } = req.body;
  const { id } = req.params;

  db.query('UPDATE employee SET name = ?, pid = ? WHERE id = ?', [name, pid, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Database update error' });
      return;
    }
    res.json({ message: 'Employee updated' });
  });
});

// Delete an employee
app.delete('/api/employee/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM employee WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Database delete error' });
      return;
    }
    res.json({ message: 'Employee deleted' });
  });
});


// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


