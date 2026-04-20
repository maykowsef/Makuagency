-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "company" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "psychofile" JSONB,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "social" JSONB,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL;
