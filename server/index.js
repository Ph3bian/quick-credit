import express from 'express';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import router from './routes';


const app = express();

app.use(bodyParser.json());
app.use(expressValidator());


app.get('/', (req, res) => {
  res.status(200).send('Hello from Quick Credit');
});

app.use('/api/v1', router);

app.listen(process.env.PORT || 3100);

export default app;