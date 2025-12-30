import express from 'express';
import { Virhe } from '../errors/virhekasittelija';
import { PrismaClient } from '@prisma/client';
import { endOfWeek, getWeek, startOfWeek } from 'date-fns';
import jwt from 'jsonwebtoken';

const prisma : PrismaClient = new PrismaClient();

const apiSaunavuorotRouter : express.Router = express.Router();

apiSaunavuorotRouter.use(express.json());

const noudaViikot = (paivamaara : Date) : number => { 
    return getWeek(paivamaara, {weekStartsOn: 1});
}

const checkToken = (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try {

        let token : string = req.headers.authorization!.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET as string);

        next();

    } catch (e: any) {
        res.status(401).json({});
    }
}


apiSaunavuorotRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {
        res.json(await prisma.saunavuoro.findMany({
            include: {
                kayttaja : true
            }
        }));
    } catch (e : any) {
        next(new Virhe());
    }

});

apiSaunavuorotRouter.get("/viikot", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {
        const saunavuorot = await prisma.saunavuoro.findMany({
            select: {
                paivamaara : true
            }
        });

        const viikot : number[] = saunavuorot.map((vuoro) => {
            const paivamaara : Date = vuoro.paivamaara;
            const viikko : number = noudaViikot(paivamaara);
            return viikko;
        })

        const uniikitViikot : number[] = [...new Set(viikot)];

        res.json(uniikitViikot);

    } catch (e : any) {
        next(new Virhe());
    }

});

apiSaunavuorotRouter.put("/:id", checkToken, async (req : express.Request, res : express.Response, next : express.NextFunction) => {
        const id : number = Number(req.params.id); // saunavuoron ID
        const kayttaja = await prisma.kayttaja.findFirst({
            where: {
                id: req.body.kayttajaId
            }
        });

        if (!kayttaja) {
            next(new Virhe());
        }

        const kayttajatunnus : string = kayttaja.kayttajatunnus

        const saunavuoro = await prisma.saunavuoro.findUnique({
            where: { 
                id : id 
            }
        });

        //Varattujen vuorojen lukumäärän vertailu per vko per talous
        const viikonAlku : Date = startOfWeek(new Date(saunavuoro.paivamaara), { weekStartsOn: 1});  // valitun viikon maanantai
        const viikonLoppu : Date = endOfWeek(new Date(saunavuoro.paivamaara), { weekStartsOn: 1}); // valitun viikon sunnuntai

        const varausOlemassa = await prisma.saunavuoro.findFirst({
            where: {
                kayttaja : {kayttajatunnus},
                paivamaara : {
                    gte : viikonAlku,
                    lte : viikonLoppu
                }
            }
        });


    
        if (varausOlemassa) {
            next(new Virhe());
        } else {
           try {
                await prisma.saunavuoro.update({
                    where: {
                        id : id
                    }, 
                    data: {
                        kayttajaId : kayttaja.id
                    }
                });

                res.json(await prisma.saunavuoro.findMany());

            } catch (e : any) {
                next(new Virhe());
            } 
        }  
    }
);

export default apiSaunavuorotRouter;