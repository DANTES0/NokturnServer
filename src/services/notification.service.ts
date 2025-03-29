import { PrismaClient } from '@prisma/client'

class NotificationService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    async createLotNotification(userId: string, lotId: number, senderId: string) {
        return await this.prisma.notification.create({
            data: {
                userId,
                type: 'new_bid',
                lotId,
                senderId,
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
            // include: {
            //     lot: true,
            //     user: true,
            // },
            orderBy: {
                createdAt: 'desc',
            },
        })
    }
    async getLotNotifications(userId: string) {
        return await this.prisma.notification.findMany({
            where: {
                userId,
                type: 'new_bid',
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

    // Получение уведомлений о сообщениях
    async getMessageNotifications(userId: string) {
        return await this.prisma.notification.findMany({
            where: {
                userId,
                type: 'new_message',
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
    }

    async markNotificationAsRead(notificationId: number) {
        return await this.prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        })
    }
    async markAllNotificationsAsRead(userId: string) {
        return await this.prisma.notification.updateMany({
            where: { userId },
            data: { isRead: true },
        })
    }
}

export default NotificationService
