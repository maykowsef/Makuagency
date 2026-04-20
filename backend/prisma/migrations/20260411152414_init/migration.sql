-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "siret" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "industry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'Active',

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellingPoint" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "siret" TEXT,
    "businessType" TEXT NOT NULL,
    "industry" TEXT,
    "street" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "email" TEXT,
    "website" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "phones" JSONB,
    "logoHistory" JSONB,
    "socialMedia" JSONB,
    "notes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellingPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "jobTitle" TEXT,
    "avatar" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactAssignment" (
    "id" SERIAL NOT NULL,
    "contactId" INTEGER NOT NULL,
    "sellingPointId" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Contact',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Minisite" (
    "id" SERIAL NOT NULL,
    "sellingPointId" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "businessType" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "overrides" JSONB,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Minisite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnnouncementProfile" (
    "id" SERIAL NOT NULL,
    "sellingPointId" INTEGER NOT NULL,
    "siteId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT,
    "targetListings" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AnnouncementProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockListing" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "reference" TEXT,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "url" TEXT,
    "description" TEXT,
    "imageUrls" JSONB,
    "attributes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ContactAssignment_contactId_sellingPointId_key" ON "ContactAssignment"("contactId", "sellingPointId");

-- CreateIndex
CREATE UNIQUE INDEX "Minisite_domain_key" ON "Minisite"("domain");

-- AddForeignKey
ALTER TABLE "SellingPoint" ADD CONSTRAINT "SellingPoint_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactAssignment" ADD CONSTRAINT "ContactAssignment_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactAssignment" ADD CONSTRAINT "ContactAssignment_sellingPointId_fkey" FOREIGN KEY ("sellingPointId") REFERENCES "SellingPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Minisite" ADD CONSTRAINT "Minisite_sellingPointId_fkey" FOREIGN KEY ("sellingPointId") REFERENCES "SellingPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnouncementProfile" ADD CONSTRAINT "AnnouncementProfile_sellingPointId_fkey" FOREIGN KEY ("sellingPointId") REFERENCES "SellingPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockListing" ADD CONSTRAINT "StockListing_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "AnnouncementProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
