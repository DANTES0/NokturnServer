-- CreateTable
CREATE TABLE "User" (
    "PK_id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT,
    "mail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "birthday_date" TIMESTAMP(3) NOT NULL,
    "vk_link" TEXT,
    "tg_link" TEXT,
    "description" TEXT,
    "profile_photo" TEXT,
    "profile_header_photo" TEXT,
    "special_info" TEXT,
    "name_visible" BOOLEAN NOT NULL DEFAULT true,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("PK_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_mail_key" ON "User"("mail");
