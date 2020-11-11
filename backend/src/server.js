import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import routes from './routes.js';

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes);

const { DB_USER, DB_PASSWORD, DB_NAME } = process.env;

mongoose.connect(
  `mongodb+srv://${DB_USER}:${DB_PASSWORD}@todo-cluster.i93aw.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const { connection } = mongoose;

connection.once('open', (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Conexão com banco de dados realizada');
  }
});

app.listen(process.env.PORT || 8080, () => console.log('Server iniciado'));
