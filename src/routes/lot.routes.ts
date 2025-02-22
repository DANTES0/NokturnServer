import lotController from '@/controllers/lot.controller'
import upload from '@/middleware/upload.middlewate'
import { Router } from 'express'

const router = Router()

router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'another_images' }]), lotController.createLot.bind(lotController))
router.post('/placeBet', lotController.placeUpdatedLotBet.bind(lotController))
router.get('/filters', lotController.getLotsByCategories.bind(lotController))
router.get('/:id', lotController.getLotById.bind(lotController))

export default router
