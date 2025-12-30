"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const prisma = new client_1.PrismaClient();
const generoiSaunavuorot = async () => {
    const vuosi = 2025;
    const viikot = [20, 21, 22, 23];
    const saunavuorojenAloitusajat = ["16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];
    for (let i = 0; i <= viikot.length - 1; i++) {
        const Tammikuun1paiva = new Date(vuosi, 0, 1);
        const paivaViikolle = (0, date_fns_1.addDays)(Tammikuun1paiva, (viikot[i] - 1) * 7);
        const viikonAlku = (0, date_fns_1.startOfWeek)(paivaViikolle, { weekStartsOn: 1 });
        const perjantai = (0, date_fns_1.addDays)(viikonAlku, 4);
        perjantai.setHours(12, 0, 0, 0);
        for (let i = 0; i <= saunavuorojenAloitusajat.length - 1; i++) {
            try {
                await prisma.saunavuoro.create({
                    data: {
                        paivamaara: perjantai,
                        kellonaika: saunavuorojenAloitusajat[i]
                    }
                });
            }
            catch {
                console.log("Virhe");
            }
        }
        ;
    }
    ;
};
generoiSaunavuorot();
/*Tämä skripti on luotu Chat-GPT:n ja date-fns-kirjaston dokumentaation avulla, erillisenä harjoitustyöstä.*/ 
