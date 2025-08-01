import session from "express-session";
import MySQLStore from "express-mysql-session";
import { getConnection } from "../database/databaseQuery.js";

const MySQLStoreSession = MySQLStore(session);

export const setupSessionMiddleware = async (app) => {
    let connection;
    try {
        connection = await getConnection();
        if (connection) {
            // Set up MySQLStore
            const sessionStore = new MySQLStoreSession({}, connection);

            // Session middleware
            app.use(session({
                key: process.env.SESSION_COOKIE_NAME, 
                secret: process.env.SESSION_SECRET_KEY,
                store: sessionStore,
                resave: false,
                saveUninitialized: false,
                cookie: { secure: false }
            }));
        }
    } catch (error) {
        console.error("Database connection error:", error);
        throw new Error(error);
    }
};