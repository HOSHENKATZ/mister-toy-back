import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import path from 'path'

import { loggerService } from './services/logger.service.js'


const app = express()

// App Configuration
app.use(cookieParser()) 
app.use(express.json()) 

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'))
} else {
  const corsOptions = {
    origin: [
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174',
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { toyRoutes } from './api/toy/toy.routes.js'
import { reviewRoutes } from './api/review/review.routes.js'

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/toy', toyRoutes)
app.use('/api/review', reviewRoutes)

// **************** Toys API ****************:
// app.get('/api/toy', (req, res) => {
//   const { txt, inStock, labels, pageIdx, sortBy } = req.query

//   const filterBy = {
//     txt: txt || '',
//     inStock: inStock || null,
//     labels: labels || [],
//     pageIdx: +pageIdx || 0,
//     sortBy: sortBy || { type: '', sortDir: 1 },
//   }

//   toyService.query(filterBy)
//     .then(toys => res.send(toys))
//     .catch(err => {
//       loggerService.error('Cannot load toys', err)
//       res.status(400).send('Cannot load toys')
//     })
// })

// app.get('/api/toy/:toyId', (req, res) => {
//   const { toyId } = req.params
//   toyService.get(toyId)
//     .then(toy => res.send(toy))
//     .catch(err => {
//       loggerService.error('Cannot get toy', err)
//       res.status(400).send(err)
//     })
// })

// app.post('/api/toy', (req, res) => {
//   const { name, price, labels } = req.body
//   const toy = {
//     name,
//     price: +price,
//     labels,
//   }
//   toyService.save(toy)
//     .then(savedToy => res.send(savedToy))
//     .catch(err => {
//       loggerService.error('Cannot add toy', err)
//       res.status(400).send('Cannot add toy')
//     })
// })

// app.put('/api/toy', (req, res) => {
//   const { name, price, _id, labels } = req.body
//   const toy = {
//     _id,
//     name,
//     price: +price,
//     labels,
//   }
//   toyService.save(toy)
//     .then(savedToy => res.send(savedToy))
//     .catch(err => {
//       loggerService.error('Cannot update toy', err)
//       res.status(400).send('Cannot update toy')
//     })
// })

// app.delete('/api/toy/:toyId', (req, res) => {
//   const { toyId } = req.params
//   toyService.remove(toyId)
//     .then(() => res.send())
//     .catch(err => {
//       loggerService.error('Cannot delete toy', err)
//       res.status(400).send('Cannot delete toy, ' + err)
//     })
// })


app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})


const port = process.env.PORT || 3030
app.listen(port, () => {
  loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
})
