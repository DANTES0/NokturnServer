import { PrismaClient } from '@prisma/client'

class NotificationService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    async createLotNotificatio(userId: string, lotId: number) {
        return await this.prisma.notification.create({
            data: {
                userId,
                type: 'new_bid',
                lotId,
            },
        })
    }

    async createMessageNotification(userId: string, senderId: string) {
        return await this.prisma.notification.create({
            data: {
                userId,
                type: 'new_message',
                senderId,
            },
        })
    }

    async getUserNotifications(userId: string) {
        return await this.prisma.notification.findMany({
            where: {
                userId,
            },
            include: {
                lot: true,
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
    }
}

export default NotificationService
