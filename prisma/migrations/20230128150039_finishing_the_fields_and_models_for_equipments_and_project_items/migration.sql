-- CreateTable
CREATE TABLE "EquipmentType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Equipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "power" DECIMAL NOT NULL,
    "isResistive" BOOLEAN NOT NULL,
    "numberOfPhases" INTEGER NOT NULL DEFAULT 1,
    "typeId" TEXT,
    CONSTRAINT "Equipment_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "EquipmentType" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Equipment" ("id", "isResistive", "name", "power") SELECT "id", "isResistive", "name", "power" FROM "Equipment";
DROP TABLE "Equipment";
ALTER TABLE "new_Equipment" RENAME TO "Equipment";
CREATE TABLE "new_ProjectItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "power" DECIMAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "roomId" TEXT,
    CONSTRAINT "ProjectItem_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProjectItem_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjectItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProjectItem" ("amount", "equipmentId", "id", "power", "projectId") SELECT "amount", "equipmentId", "id", "power", "projectId" FROM "ProjectItem";
DROP TABLE "ProjectItem";
ALTER TABLE "new_ProjectItem" RENAME TO "ProjectItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
