import artController from '@/controllers/art.controller'
import { upload } from '@/middleware/upload.middlewate'
import { Router } from 'express'

const router = Router()

router.post('/', upload.fields([{ name: 'image' }]), artController.createArt.bind(artController))
router.get('/', artController.getArtsAll.bind(artController))
router.get('/:userId', artController.getArtsById.bind(artController))
router.delete('/:artId', artController.deleteArt.bind(artController))

export default router
