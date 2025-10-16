-- CreateTable
CREATE TABLE "HsnFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "hsnCode" TEXT NOT NULL,
    "description" TEXT,
    "rating" INTEGER NOT NULL,
    "accuracy" TEXT,
    "helpful" BOOLEAN,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HsnFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "HsnFeedback_userId_idx" ON "HsnFeedback"("userId");

-- CreateIndex
CREATE INDEX "HsnFeedback_hsnCode_idx" ON "HsnFeedback"("hsnCode");

-- CreateIndex
CREATE INDEX "HsnFeedback_createdAt_idx" ON "HsnFeedback"("createdAt");
