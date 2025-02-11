import lotController from '@/controllers/lot.controller'
import upload from '@/middleware/upload.middlewate'
import { Router } from 'express'

const router = Router()

router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'another_images' }]), lotController.createLot.bind(lotController))

export default router
