-- CreateTable
CREATE TABLE "Lot" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "starting_bet" TEXT NOT NULL,
    "current_bet" TEXT NOT NULL,
    "begin_time_date" TIMESTAMP(3) NOT NULL,
    "end_time_date" TIMESTAMP(3) NOT NULL,
    "another_images" TEXT[],
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lot" ADD CONSTRAINT "Lot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
