import express from 'express';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import swaggerDocument from '../swagger.json';
import router from './routes';


const app = express();
// morgan is used for logging
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(expressValidator());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get('/', (req, res) => res.status(200).send('Hello from Quick Credit'));

app.use('/api/v1', router);
app.get('*', (req, res) => res.status(404).send('Not found'));


app.listen(process.env.PORT || 3100);

export default app;
