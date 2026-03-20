-- CreateTable
CREATE TABLE "AccountProfile" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "usernameNormalized" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sourceIp" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountProfile_usernameNormalized_key" ON "AccountProfile"("usernameNormalized");

-- CreateIndex
CREATE UNIQUE INDEX "AccountProfile_email_key" ON "AccountProfile"("email");

-- CreateIndex
CREATE INDEX "AccountProfile_createdAt_idx" ON "AccountProfile"("createdAt");

