import { ZodError, ZodIssue } from 'zod'

export const apiResponse = (code: number, message: string, data: any) => {
     const response = {
          meta: {
               code,
               message
          },
          data
     }
     return response;
}



export const formatZodError = (error: ZodError) => {

     const { issues } = error

     const convertedErrorExpected: Record<string, string[]> = {}

     issues.map((issue: ZodIssue) => {
          const { path, message } = issue
          const key = path.join('.')
          if (convertedErrorExpected[key]) {
               convertedErrorExpected[key].push(message)
          } else {
               convertedErrorExpected[key] = [message]
          }
     })
     return { errors: convertedErrorExpected }
}