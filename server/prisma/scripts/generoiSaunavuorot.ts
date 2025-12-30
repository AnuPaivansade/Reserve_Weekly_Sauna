import { PrismaClient } from '@prisma/client';
import { addDays, startOfWeek } from 'date-fns';

const prisma : PrismaClient = new PrismaClient();

const generoiSaunavuorot = async () : Promise<void> => {
    const vuosi : number = 2025;
    const viikot : number[] = [20,21,22,23];
    const saunavuorojenAloitusajat : string[] = ["16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

    for (let i : number = 0; i <= viikot.length-1; i++) {
        const Tammikuun1paiva : Date = new Date(vuosi, 0, 1);

        const paivaViikolle : Date = addDays(Tammikuun1paiva, (viikot[i]-1) * 7)
        
        const viikonAlku : Date = startOfWeek(paivaViikolle, {weekStartsOn: 1})
        const perjantai : Date = addDays(viikonAlku, 4)
        perjantai.setHours(12,0,0,0);

        for (let i : number = 0; i <= saunavuorojenAloitusajat.length-1; i++) {
            try {
                await prisma.saunavuoro.create({
                    data: {
                        paivamaara: perjantai,
                        kellonaika : saunavuorojenAloitusajat[i]
                    }    
            })
            } catch {
                console.log("Virhe")
            }
        };
    };
};

generoiSaunavuorot();

/*Tämä skripti on luotu Chat-GPT:n ja date-fns-kirjaston dokumentaation avulla, erillisenä harjoitustyöstä.*/