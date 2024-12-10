const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/products');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((error) => console.log(error.message));

// API Routes
app.use('/api/products', require('./routes/products'));
app.use('/api', productRoutes);
app.use('/graphql', graphqlHTTP({ schema, rootValue: resolvers }));
app.use('/api/orders', orderRoutes); // RESTful route