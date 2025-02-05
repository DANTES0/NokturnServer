import authController from '@/controllers/auth.controller'
import userController from '@/controllers/user.controller'
import AuthMiddleware from '@/middleware/auth.middleware'
import { Router } from 'express'

const router = Router()
router.get('/me', AuthMiddleware.verifyToken, userController.getCurrentUser.bind(userController))
router.get('/:id', userController.getUser.bind(userController))
router.post('/', userController.createUser.bind(userController))
router.get('', userController.getAllUsers.bind(userController))

export default router
