/*
  Warnings:

  - Added the required column `taloyhtio` to the `Kayttaja` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Kayttaja" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "taloyhtio" TEXT NOT NULL,
    "kayttajatunnus" TEXT NOT NULL,
    "salasanaHash" TEXT NOT NULL
);
INSERT INTO "new_Kayttaja" ("id", "kayttajatunnus", "salasanaHash") SELECT "id", "kayttajatunnus", "salasanaHash" FROM "Kayttaja";
DROP TABLE "Kayttaja";
ALTER TABLE "new_Kayttaja" RENAME TO "Kayttaja";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
