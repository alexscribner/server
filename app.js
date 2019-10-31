require('dotenv').config();

const express = require('express');
const app = express();

const pet = require('./controllers/petcontroller');
const user = require('./controllers/usercontroller');

const sequelize = require('./db');

sequelize.sync();
app.use(express.json());
app.use(require('./middleware/headers'));

app.use('/pet', pet);
app.use('/user', user);

app.listen(process.env.PORT, () => console.log(`App is listening on port ${process.env.PORT}`));