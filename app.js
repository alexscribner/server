require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./db');

const pet = require('./controllers/petcontroller');
const user = require('./controllers/usercontroller');
const image = require('./controllers/imageController');


sequelize.sync();
app.use(express.json());
app.use(require('./middleware/headers'));

app.use('/pet', pet);
app.use('/user', user);
app.use('/images', image)

app.listen(process.env.PORT, () => console.log(`App is listening on port ${process.env.PORT}`));