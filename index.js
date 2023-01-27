import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./models/index.js";
import userRoutes from "./routes/userRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";

const app = express();

// Express json parser
app.use(express.json());

// Env variables
dotenv.config();

// Database conection
db.authenticate()
    .then( () => console.log('Base de datos conectada') )
    .catch( error => console.log(error) )

// Destructive create database

/*
db.sync({ force: true })
    .then( () => console.log('Base de datos reconfigurada') )
    .catch( error => console.log(error) )
*/


const allowedDomains = [process.env.FRONTEND_URL];


const corsOptions = {
    origin: function(origin, callback) {
        if (allowedDomains.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("No allowed"));
        }
    }
};


app.use(cors(corsOptions));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/testimonials", testimonialRoutes);

// Port
const PORT = process.env.PORT || 4000;

// Listen
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});
