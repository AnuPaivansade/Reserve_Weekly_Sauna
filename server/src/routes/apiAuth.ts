import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Virhe } from '../errors/virhekasittelija';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const apiAuthRouter : express.Router = express.Router();

const prisma : PrismaClient = new PrismaClient();

apiAuthRouter.use(express.json());

apiAuthRouter.post("/login", async (req : express.Request, res : express.Response, next : express.NextFunction) : Promise<void> => {

    try {

        const kayttaja = await prisma.kayttaja.findFirst({
            where : {
                sahkopostiosoite : req.body.sahkopostiosoite
            }
        });

        if (req.body.sahkopostiosoite === kayttaja?.sahkopostiosoite) {

            let hash = crypto.createHash("SHA512").update(req.body.salasana).digest("hex");

            if (hash === kayttaja?.salasanaHash) {

                let token = jwt.sign({}, process.env.JWT_SECRET as string);

                res.json({ 
                    token : token, 
                    kayttajaId: kayttaja.id,
                    kayttajatunnus: kayttaja.kayttajatunnus 
                })


            } else {
                next(new Virhe(401, "Virheellinen käyttäjätunnus tai salasana"));
            }

        } else {
            next(new Virhe(401, "Virheellinen käyttäjätunnus tai salasana"));
        }

    } catch {
        next(new Virhe());
    }

});


apiAuthRouter.post("/register", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (req.body.taloyhtio?.toLowerCase() === "as oy metsämäki") {
        if (req.body.sahkopostiosoite?.length > 0 && req.body.kayttajatunnus?.length > 0 && req.body.salasana?.length > 0) {

            try {

                await prisma.kayttaja.create({
                    data : {
                        taloyhtio: req.body.taloyhtio,
                        sahkopostiosoite: req.body.sahkopostiosoite,
                        kayttajatunnus : req.body.kayttajatunnus,
                        salasanaHash : crypto.createHash("SHA512").update(req.body.salasana).digest("hex")
                    }
                });

                res.json({viesti: "Uusi käyttäjätunnus rekisteröity."});
        
            } catch (e : any) {
                next(new Virhe())
            }

        } else {
            next(new Virhe(400, "Virheellinen pyynnön body"));
        }
    } else {
        res.json({viesti: "Rekisteröityminen sallitaan vain taloyhtiön 'As Oy Metsämäki' asukkaille. Tarkista kirjoitusasu."})
    }
});

export default apiAuthRouter;

//Käyttäjän kirjautumisen ja rekisteröitymisen hallinta