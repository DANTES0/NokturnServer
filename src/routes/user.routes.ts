import userController from '@/controllers/user.controller'
import { Router } from 'express'

const router = Router()

router.get('/:id', userController.getUser.bind(userController))
router.post('/', userController.createUser.bind(userController))
router.get('', userController.getAllUsers.bind(userController))

export default router
