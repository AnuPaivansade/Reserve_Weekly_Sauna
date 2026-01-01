-- CreateTable
CREATE TABLE "Kayttaja" (
    "id" SERIAL NOT NULL,
    "taloyhtio" TEXT NOT NULL,
    "kayttajatunnus" TEXT NOT NULL,
    "sahkopostiosoite" TEXT NOT NULL,
    "salasanaHash" TEXT NOT NULL,

    CONSTRAINT "Kayttaja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Saunavuoro" (
    "id" SERIAL NOT NULL,
    "paivamaara" TIMESTAMP(3) NOT NULL,
    "kellonaika" TEXT NOT NULL,
    "kayttajaId" INTEGER,

    CONSTRAINT "Saunavuoro_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Saunavuoro" ADD CONSTRAINT "Saunavuoro_kayttajaId_fkey" FOREIGN KEY ("kayttajaId") REFERENCES "Kayttaja"("id") ON DELETE SET NULL ON UPDATE CASCADE;
