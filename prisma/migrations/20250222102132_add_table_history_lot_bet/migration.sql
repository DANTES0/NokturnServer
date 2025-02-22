-- CreateTable
CREATE TABLE "HistoryLotBet" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "lotId" INTEGER NOT NULL,
    "time_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bet" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "HistoryLotBet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HistoryLotBet" ADD CONSTRAINT "HistoryLotBet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryLotBet" ADD CONSTRAINT "HistoryLotBet_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
