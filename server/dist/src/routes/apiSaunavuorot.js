"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const virhekasittelija_1 = require("../errors/virhekasittelija");
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const apiSaunavuorotRouter = express_1.default.Router();
apiSaunavuorotRouter.use(express_1.default.json());
const noudaViikot = (paivamaara) => {
    return (0, date_fns_1.getWeek)(paivamaara, { weekStartsOn: 1 });
};
const checkToken = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch (e) {
        res.status(401).json({});
    }
};
apiSaunavuorotRouter.get("/", async (req, res, next) => {
    try {
        res.json(await prisma.saunavuoro.findMany({
            include: {
                kayttaja: true
            }
        }));
    }
    catch (e) {
        next(new virhekasittelija_1.Virhe());
    }
});
apiSaunavuorotRouter.get("/viikot", async (req, res, next) => {
    try {
        const saunavuorot = await prisma.saunavuoro.findMany({
            select: {
                paivamaara: true
            }
        });
        const viikot = saunavuorot.map((vuoro) => {
            const paivamaara = vuoro.paivamaara;
            const viikko = noudaViikot(paivamaara);
            return viikko;
        });
        const uniikitViikot = [...new Set(viikot)];
        res.json(uniikitViikot);
    }
    catch (e) {
        next(new virhekasittelija_1.Virhe());
    }
});
apiSaunavuorotRouter.put("/:id", checkToken, async (req, res, next) => {
    const id = Number(req.params.id); // saunavuoron ID
    const kayttaja = await prisma.kayttaja.findFirst({
        where: {
            id: req.body.kayttajaId
        }
    });
    if (!kayttaja) {
        next(new virhekasittelija_1.Virhe());
    }
    const kayttajatunnus = kayttaja.kayttajatunnus;
    const saunavuoro = await prisma.saunavuoro.findUnique({
        where: {
            id: id
        }
    });
    //Varattujen vuorojen lukumäärän vertailu per vko per talous
    const viikonAlku = (0, date_fns_1.startOfWeek)(new Date(saunavuoro.paivamaara), { weekStartsOn: 1 }); // valitun viikon maanantai
    const viikonLoppu = (0, date_fns_1.endOfWeek)(new Date(saunavuoro.paivamaara), { weekStartsOn: 1 }); // valitun viikon sunnuntai
    const varausOlemassa = await prisma.saunavuoro.findFirst({
        where: {
            kayttaja: { kayttajatunnus },
            paivamaara: {
                gte: viikonAlku,
                lte: viikonLoppu
            }
        }
    });
    if (varausOlemassa) {
        next(new virhekasittelija_1.Virhe());
    }
    else {
        try {
            await prisma.saunavuoro.update({
                where: {
                    id: id
                },
                data: {
                    kayttajaId: kayttaja.id
                }
            });
            res.json(await prisma.saunavuoro.findMany());
        }
        catch (e) {
            next(new virhekasittelija_1.Virhe());
        }
    }
});
exports.default = apiSaunavuorotRouter;
