import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes'
import { errorHandler } from './middlewares/errorHandler'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('🚀 VMudra Backend is running!');
});

app.use('/api', routes)

app.use(errorHandler)

export default app
