import multer from 'multer'
import path from 'path'
import sharp from 'sharp'
import fs from 'fs/promises' // Используем fs.promises
import crypto from 'crypto'

import { Request, Response, NextFunction } from 'express'
import UserService from '@/services/user.service'

const userService = new UserService()

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

const addWatermark = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || !('image' in req.files) || !req.files['image'][0]) {
        return next()
    }

    const { category, userId } = req.body as { category?: string; userId?: string }

    if (category !== 'Цифровое искусство' || !userId) {
        return next()
    }

    try {
        const user = await userService.findUserById(userId)
        if (!user || !user.firstname) {
            return res.status(404).json({ error: 'Пользователь не найден' })
        }

        const username = user.firstname
        console.log('Найден username:', username)

        const file = req.files['image'][0]
        const inputPath = file.path

        const hashedName = crypto.createHash('md5').update(path.basename(inputPath)).digest('hex')
        const outputPath = path.join(path.dirname(inputPath), `watermarked_${hashedName}${path.extname(inputPath)}`)

        console.log('Обрабатываем файл:', inputPath)

        const fontPath = path.join(__dirname, '..', 'assets', 'fonts', 'LeviBrush.ttf')
        const fontBuffer = await fs.readFile(fontPath)
        const fontBase64 = `data:font/ttf;base64,${fontBuffer.toString('base64')}`

        const { width, height } = await sharp(inputPath).metadata()

        const watermarkWidth = Math.round(width * 0.6)
        const watermarkHeight = Math.round(height * 0.2)
        const watermarkBuffer = await sharp({
            create: {
                width: watermarkWidth,
                height: watermarkHeight,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 0 },
            },
        })
            .png()
            .composite([
                {
                    input: Buffer.from(
                        `<svg width="${watermarkWidth}" height="${watermarkHeight}" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <style type="text/css">
                            @font-face {
                                font-family: 'LeviBrushRus';
                                src: url('${fontBase64}');
                            }
                            .custom-font {
                                font-family: 'LeviBrushRus';
                                font-size: ${Math.round(watermarkHeight * 0.3)}px;
                                font-weight: bold;
                                fill: rgba(0,0,0,0.5);
                                text-anchor: middle;
                                alignment-baseline: middle;
                            }
                        </style>
                    </defs>
                    <text x="50%" y="40%" class="custom-font">@Nokturn</text>
                    <text x="50%" y="90%" class="custom-font">${username}</text>
                </svg>`,
                    ),
                    gravity: 'center',
                },
            ])
            .toBuffer()

        await sharp(inputPath)
            .composite([{ input: watermarkBuffer, gravity: 'center' }])
            .toFile(outputPath)

        console.log('Водяной знак успешно добавлен:', outputPath)

        file.filename = path.basename(outputPath)
        file.path = outputPath
        req.files['image'][0] = file

        next()
    } catch (error) {
        console.error('Ошибка обработки водяного знака:', error)
        res.status(500).json({ error: 'Ошибка наложения водяного знака' })
    }
}

export { upload, addWatermark }
