import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import routers from "./app/routers";
import path from "path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json({ limit: "9999999999mb" }));
app.use(bodyParser.urlencoded({ limit: "9999999999mb", extended: true }));
app.use(cookieParser());

app.use(routers);

if (process.env.NODE_ENV !== "development") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    try {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    } catch (e) {
      console.log(e);
    }
  });
}

app.listen(PORT, () =>
  console.log(`-----------> Servidor rodando na porta ${PORT}!`)
);

mongoose
  .connect(process.env.MONGO_CONNECTION_URL)
  .then(() => console.log("-----------> Bando de dados conectado"))
  .catch((e) => console.log("Erro ao se conectar com o banco: " + e));
