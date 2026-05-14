import fs from "fs"
import { startServer, connectWithDatabase } from "./app.js";

await connectWithDatabase()
    .then(() => {
        startServer();
    })
    .catch((error) => {
        console.error("❌ Database initialization failed:", error);
        process.exit(1);
    });

if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}
