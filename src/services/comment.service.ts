import { PrismaClient, CommentsLot } from '@prisma/client'

class CommentService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    async getCommentsByLot(lotId: number): Promise<CommentsLot[] | null> {
        try {
            return await this.prisma.commentsLot.findMany({
                where: { lotId },
                include: {
                    user: {
                        select: { id: true, firstname: true, lastname: true, profile_photo: true },
                    },
                    replies: {
                        include: {
                            user: {
                                select: { id: true, firstname: true, lastname: true, profile_photo: true },
                            },
                        },
                    },
                },
            })
        } catch (error) {
            throw console.log(error)
        }
    }

    async addComment(userId: string, lotId: number, commentsText: string, parentId?: number): Promise<CommentsLot> {
        try {
            return await this.prisma.commentsLot.create({
                data: { userId, lotId, commentsText, parentId },
            })
        } catch (error) {
            throw console.log(error)
        }
    }

    async deleteComment(id: number): Promise<CommentsLot> {
        try {
            return await this.prisma.commentsLot.delete({ where: { id } })
        } catch (error) {
            throw console.log(error)
        }
    }
}

export default CommentService
