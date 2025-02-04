import userController from '@/controllers/user.controller'
import { Router } from 'express'

const router = Router()

router.get('/:id', userController.getUser.bind(userController))
router.post('/', userController.createUser.bind(userController))

export default router
