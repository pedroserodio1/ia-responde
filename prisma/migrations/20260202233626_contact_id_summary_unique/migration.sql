/*
  Warnings:

  - A unique constraint covering the columns `[contactId]` on the table `Summary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Summary_contactId_key" ON "Summary"("contactId");
