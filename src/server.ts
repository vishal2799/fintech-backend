import express, { ErrorRequestHandler } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes'
import globalErrorHandler from './middlewares/errorHandler'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('🚀 VMudra Backend is running!');
});

app.use('/api', routes)

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use(globalErrorHandler);

export default app
