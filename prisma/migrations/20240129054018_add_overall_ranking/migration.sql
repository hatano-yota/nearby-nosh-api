-- CreateTable
CREATE TABLE "OverallRanking" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OverallRanking_pkey" PRIMARY KEY ("id")
);
