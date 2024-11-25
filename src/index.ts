import express, { Express } from 'express'
import { PORT } from './secrets'
import { PrismaClient } from '@prisma/client'
import rootRouter from './routes'
import { SignupSchema } from './schema/users'
import { errorMiddleware } from './middlewares/errors'
import { app, server } from './lib/socket'

var cors = require('cors')

app.use(express.json())
app.use(cors({ origin: true, credentials: true }));
app.use('/api', rootRouter)

export const prismaClient = new PrismaClient({
     log: ['query'],
}).$extends({
     query: {
          user: {
               create({ args, query }) {
                    args.data = SignupSchema.parse(args.data)
                    return query(args)
               }
          }
     }
})

app.use(errorMiddleware)

server.listen(PORT, () => {
     console.log('Server alive on port', PORT)
})