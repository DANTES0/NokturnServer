import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'uploads'))
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        cb(null, `user-${Date.now()}${ext}`)
    },
})

const upload = multer({
    storage,
    limits: {
        fileSize: 30 * 1024 * 1024,
    },
})

export default upload
