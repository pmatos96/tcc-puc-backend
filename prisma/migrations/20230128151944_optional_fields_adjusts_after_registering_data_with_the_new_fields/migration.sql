/*
  Warnings:

  - Made the column `typeId` on table `Equipment` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Equipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "power" DECIMAL NOT NULL,
    "isResistive" BOOLEAN NOT NULL,
    "numberOfPhases" INTEGER NOT NULL DEFAULT 1,
    "typeId" TEXT NOT NULL,
    CONSTRAINT "Equipment_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "EquipmentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Equipment" ("id", "isResistive", "name", "numberOfPhases", "power", "typeId") SELECT "id", "isResistive", "name", "numberOfPhases", "power", "typeId" FROM "Equipment";
DROP TABLE "Equipment";
ALTER TABLE "new_Equipment" RENAME TO "Equipment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
