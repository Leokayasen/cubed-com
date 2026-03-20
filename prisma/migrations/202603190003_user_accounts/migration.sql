-- CreateTable
CREATE TABLE "UserAccount" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailNormalized" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "usernameNormalized" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "reserveCubedUsername" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "AccountProfile" ADD COLUMN "accountId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_emailNormalized_key" ON "UserAccount"("emailNormalized");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_usernameNormalized_key" ON "UserAccount"("usernameNormalized");

-- CreateIndex
CREATE INDEX "UserAccount_createdAt_idx" ON "UserAccount"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AccountProfile_accountId_key" ON "AccountProfile"("accountId");

-- AddForeignKey
ALTER TABLE "AccountProfile"
ADD CONSTRAINT "AccountProfile_accountId_fkey"
FOREIGN KEY ("accountId") REFERENCES "UserAccount"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

