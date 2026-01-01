import express from 'express';
import path from 'path';
import apiAuthRouter from './routes/apiAuth';
import apiSaunavuorotRouter from './routes/apiSaunavuorot';
import virhekasittelija from './errors/virhekasittelija';
import cors from 'cors';
import dotenv from "dotenv";
import seedIfEmpty from './seed'

dotenv.config();
const app : express.Application = express();

const port : number = Number(process.env.PORT) || 3110;
app.use(express.static(path.resolve(__dirname, "public")));

app.use(cors({
    origin: process.env.CORS_ORIGIN?.replace(/\/$/, "") || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));


app.use("/api/auth", apiAuthRouter);
app.use("/api/saunavuorot", apiSaunavuorotRouter);

app.use(virhekasittelija);

app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (!res.headersSent) {
        res.status(404).json({ viesti : "Virheellinen reitti"});
    }

    next();
});

seedIfEmpty()
    .then(() => {
        app.listen(port, () => {
        console.log(`Palvelin on käytössä portissa ${port}`);
        });
    })
    .catch((err) => {
        console.error('Virhe seed-funktion ajossa:', err);
});