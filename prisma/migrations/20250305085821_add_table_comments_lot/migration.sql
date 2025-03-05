-- CreateTable
CREATE TABLE "CommentsLot" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "lotId" INTEGER NOT NULL,
    "commentsText" TEXT NOT NULL,
    "parentId" INTEGER,
    "timeDateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CommentsLot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommentsLot_lotId_idx" ON "CommentsLot"("lotId");

-- CreateIndex
CREATE INDEX "CommentsLot_parentId_idx" ON "CommentsLot"("parentId");

-- AddForeignKey
ALTER TABLE "CommentsLot" ADD CONSTRAINT "CommentsLot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentsLot" ADD CONSTRAINT "CommentsLot_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentsLot" ADD CONSTRAINT "CommentsLot_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CommentsLot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
