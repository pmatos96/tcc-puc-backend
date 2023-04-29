-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "power" DECIMAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "phasesNumber" INTEGER NOT NULL DEFAULT 1,
    "equipmentId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "roomId" TEXT,
    CONSTRAINT "ProjectItem_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProjectItem_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjectItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProjectItem" ("amount", "equipmentId", "id", "power", "projectId", "roomId") SELECT "amount", "equipmentId", "id", "power", "projectId", "roomId" FROM "ProjectItem";
DROP TABLE "ProjectItem";
ALTER TABLE "new_ProjectItem" RENAME TO "ProjectItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
