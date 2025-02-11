/*
  Warnings:

  - Added the required column `description` to the `Lot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `min_bid_increment` to the `Lot` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `starting_bet` on the `Lot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `current_bet` on the `Lot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Lot" ADD COLUMN     "buyer_id" TEXT,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "lot_status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "min_bid_increment" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "reserve_price" DOUBLE PRECISION,
DROP COLUMN "starting_bet",
ADD COLUMN     "starting_bet" DOUBLE PRECISION NOT NULL,
DROP COLUMN "current_bet",
ADD COLUMN     "current_bet" DOUBLE PRECISION NOT NULL;
