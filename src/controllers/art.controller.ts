import ArtService from '@/services/art.service'
import { Request, Response } from 'express'

class ArtController {
    private artService: ArtService

    constructor() {
        this.artService = new ArtService()
    }

    async createArt(req: Request, res: Response): Promise<void> {
        try {
            const { userId, name, load_time } = req.body
            const file = req.files as { image?: Express.Multer.File[] }
            const newArt = await this.artService.createArt(userId, name, load_time, file)
            res.status(200).json(newArt)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }

    async getArtsById(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId
            const arts = await this.artService.getArtsById(userId)
            res.status(200).json(arts)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }

    async getArtsAll(req: Request, res: Response): Promise<void> {
        try {
            const searchQuery = req.query.search as string | undefined
            const arts = await this.artService.getArtAll(searchQuery)
            res.status(200).json(arts)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }
    async deleteArt(req: Request, res: Response): Promise<void> {
        try {
            const artId = Number(req.params.artId)
            if (isNaN(artId)) {
                res.status(400).json({ message: 'Некорректный ID' })
            }

            const deletedArt = await this.artService.deleteArt(artId)
            if (!deletedArt) {
                res.status(404).json({ message: 'Арт не найден' })
            }

            res.json({ message: 'Арт успешно удален', deletedArt })
        } catch (error) {
            res.status(500).json({ message: `Ошибка при удалении арта: ${error}` })
        }
    }
}

export default new ArtController()
