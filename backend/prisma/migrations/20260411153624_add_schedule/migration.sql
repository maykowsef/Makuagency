-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "sellingPointId" INTEGER NOT NULL,
    "sellingPointName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "scheduler" TEXT NOT NULL,
    "schedulerId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "isConvinced" BOOLEAN NOT NULL DEFAULT false,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "calls" JSONB,
    "rescheduleHistory" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);
