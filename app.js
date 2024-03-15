const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({ message: 'hello', app: 'natours' });
});

app.post('/', (req, res) => {
  res.json({ requestBody: req.body });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
