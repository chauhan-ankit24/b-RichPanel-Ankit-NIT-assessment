const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();
const PORT = 3000;
require('dotenv').config();

app.use(express.json());
app.use(cors())

const routes = require('./Routes/Routes');
app.use('/', routes);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'Dummydb',
}).then(() => {
  console.log('Connected');
}).catch((error) => {
  console.error(' connecting error :', error);
});

app.use((req, res) => {
  res.status(404).send('(404) Not Found');
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
