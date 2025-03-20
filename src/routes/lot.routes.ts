import lotController from '@/controllers/lot.controller'
import { upload, addWatermark } from '@/middleware/upload.middlewate'
import { Router } from 'express'

const router = Router()

router.post(
    '/',
    upload.fields([{ name: 'image', maxCount: 1 }, { name: 'another_images' }]),
    addWatermark,
    lotController.createLot.bind(lotController),
)
router.post('/placeBet', lotController.placeUpdatedLotBet.bind(lotController))
router.get('/history/:lotId', lotController.getHistoryLot.bind(lotController))
router.get('/filters', lotController.getLotsByCategories.bind(lotController))
router.get('/:id', lotController.getLotById.bind(lotController))
router.put(
    '/:id',
    upload.fields([{ name: 'image', maxCount: 1 }, { name: 'another_images' }]),
    addWatermark,
    lotController.updateLot.bind(lotController),
)
router.delete('/:id', lotController.deleteLot.bind(lotController))

export default router
