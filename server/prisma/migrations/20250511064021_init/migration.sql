-- CreateTable
CREATE TABLE "Kayttaja" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kayttajatunnus" TEXT NOT NULL,
    "salasanaHash" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Saunavuoro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "paivamaara" DATETIME NOT NULL,
    "kellonaika" TEXT NOT NULL,
    "kayttajaId" INTEGER,
    CONSTRAINT "Saunavuoro_kayttajaId_fkey" FOREIGN KEY ("kayttajaId") REFERENCES "Kayttaja" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
