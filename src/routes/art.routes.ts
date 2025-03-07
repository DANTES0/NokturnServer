import artController from '@/controllers/art.controller'
import upload from '@/middleware/upload.middlewate'
import { Router } from 'express'

const router = Router()

router.post('/', upload.fields([{ name: 'image' }]), artController.createArt.bind(artController))
router.get('/:userId', artController.getArtsById.bind(artController))

export default router
