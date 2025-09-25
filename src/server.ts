import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes'
import globalErrorHandler from './middlewares/errorHandler'
import { extractTenant } from './middlewares/extractSubdomain'
import { auditLogger } from './middlewares/auditLogger'

dotenv.config()

const app = express()

//app.set('trust proxy', true);

app.use(cors())
app.use(express.json())
app.use(extractTenant);

// app.use(auditLogger);

app.get('/', (req, res) => {
  res.send('🚀 VMudra Backend is running!');
});

// health route (super light)
app.get('/health', (_req, res) => {
  res.status(200).send('ok');
  console.log('pinged');
});


app.use('/api', routes)

// app.use('*', (req, res) => {
//   res.status(404).json({ message: 'Not Found' });
// });

app.use(globalErrorHandler);

export default app
