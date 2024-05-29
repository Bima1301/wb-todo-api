import express, { Express } from 'express'
import { PORT } from './secrets'
import { PrismaClient } from '@prisma/client'
import rootRouter from './routes'
import { SignupSchema } from './schema/users'
import { errorMiddleware } from './middlewares/errors'

const app: Express = express()

app.use(express.json())
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

app.listen(PORT, () => {
     console.log('Server Running on port ' + PORT)
})