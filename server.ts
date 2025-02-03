import express, { Request, Response } from 'express'

const app = express()

function main() {
    app.use(express.json())

    app.use('/api/nokturn', (req: Request, res: Response) => {
        res.status(200).json({
            message: 'success'
        })
    })

    app.listen(3000, () => {
        console.log('Server is running on port 3000')
    })
}

main()
