"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const apiAuth_1 = __importDefault(require("./routes/apiAuth"));
const apiSaunavuorot_1 = __importDefault(require("./routes/apiSaunavuorot"));
const virhekasittelija_1 = __importDefault(require("./errors/virhekasittelija"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3110;
app.use(express_1.default.static(path_1.default.resolve(__dirname, "public")));
app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use("/api/auth", apiAuth_1.default);
app.use("/api/saunavuorot", apiSaunavuorot_1.default);
app.use(virhekasittelija_1.default);
app.use((req, res, next) => {
    if (!res.headersSent) {
        res.status(404).json({ viesti: "Virheellinen reitti" });
    }
    next();
});
app.listen(port, () => {
    console.log("Palvelin on käytössä portissa " + port);
});
