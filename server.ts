import express, { Request, Response } from 'express'

import dotenv from 'dotenv'

dotenv.config()

const app = express()

function main() {
  app.use(express.json())

  app.use('/api/nokturn', (req: Request, res: Response) => {
    res.status(200).json({
      message: 'success',
    })
  })
  console.log(process.env.PORT)
  app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000')
  })
}

main()
