import CommentController from '@/controllers/comment.controller'
import { Router } from 'express'

const router = Router()

router.get('/:lotId', CommentController.getComments.bind(CommentController))
router.post('/', CommentController.addComment.bind(CommentController))
router.delete('/:commentId', CommentController.deleteComment.bind(CommentController))

export default router
