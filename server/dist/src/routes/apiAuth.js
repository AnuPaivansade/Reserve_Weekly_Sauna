"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const virhekasittelija_1 = require("../errors/virhekasittelija");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const apiAuthRouter = express_1.default.Router();
const prisma = new client_1.PrismaClient();
apiAuthRouter.use(express_1.default.json());
apiAuthRouter.post("/login", async (req, res, next) => {
    try {
        const kayttaja = await prisma.kayttaja.findFirst({
            where: {
                sahkopostiosoite: req.body.sahkopostiosoite
            }
        });
        if (req.body.sahkopostiosoite === kayttaja?.sahkopostiosoite) {
            let hash = crypto_1.default.createHash("SHA512").update(req.body.salasana).digest("hex");
            if (hash === kayttaja?.salasanaHash) {
                let token = jsonwebtoken_1.default.sign({}, process.env.JWT_SECRET);
                res.json({
                    token: token,
                    kayttajaId: kayttaja.id,
                    kayttajatunnus: kayttaja.kayttajatunnus
                });
            }
            else {
                next(new virhekasittelija_1.Virhe(401, "Virheellinen käyttäjätunnus tai salasana"));
            }
        }
        else {
            next(new virhekasittelija_1.Virhe(401, "Virheellinen käyttäjätunnus tai salasana"));
        }
    }
    catch {
        next(new virhekasittelija_1.Virhe());
    }
});
apiAuthRouter.post("/register", async (req, res, next) => {
    if (req.body.taloyhtio?.toLowerCase() === "as oy metsämäki") {
        if (req.body.sahkopostiosoite?.length > 0 && req.body.kayttajatunnus?.length > 0 && req.body.salasana?.length > 0) {
            try {
                await prisma.kayttaja.create({
                    data: {
                        taloyhtio: req.body.taloyhtio,
                        sahkopostiosoite: req.body.sahkopostiosoite,
                        kayttajatunnus: req.body.kayttajatunnus,
                        salasanaHash: crypto_1.default.createHash("SHA512").update(req.body.salasana).digest("hex")
                    }
                });
                res.json({ viesti: "Uusi käyttäjätunnus rekisteröity." });
            }
            catch (e) {
                next(new virhekasittelija_1.Virhe());
            }
        }
        else {
            next(new virhekasittelija_1.Virhe(400, "Virheellinen pyynnön body"));
        }
    }
    else {
        res.json({ viesti: "Rekisteröityminen sallitaan vain taloyhtiön 'As Oy Metsämäki' asukkaille. Tarkista kirjoitusasu." });
    }
});
exports.default = apiAuthRouter;
//Käyttäjän kirjautumisen ja rekisteröitymisen hallinta
