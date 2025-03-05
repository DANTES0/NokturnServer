import CommentService from '@/services/comment.service'
import { Request, Response } from 'express'

class CommentController {
    private commentService: CommentService

    constructor() {
        this.commentService = new CommentService()
    }

    async getComments(req: Request, res: Response): Promise<void> {
        try {
            const lotId = parseInt(req.params.lotId)
            const comments = await this.commentService.getCommentsByLot(lotId)
            res.status(200).json(comments)
        } catch (error) {
            res.status(500).json({ error: 'Ошибка получения комментариев' })
        }
    }

    async addComment(req: Request, res: Response): Promise<void> {
        try {
            const { userId, lotId, commentsText, parentId } = req.body
            if (!userId || !lotId || !commentsText) {
                res.status(400).json({ error: 'Заполните все поля' })
            }
            const newComment = await this.commentService.addComment(userId, lotId, commentsText, parentId)
            res.status(200).json(newComment)
        } catch (error) {
            res.status(500).json({ error: 'Ошибка добавления комментария' })
        }
    }

    async deleteComment(req: Request, res: Response): Promise<void> {
        try {
            const commentId = parseInt(req.params.commentId)
            await this.commentService.deleteComment(commentId)
            res.json({ message: 'Комментарий удален' })
        } catch (error) {
            res.status(500).json({ error: 'Ошибка удаления комментария' })
        }
    }
}

export default new CommentController()
