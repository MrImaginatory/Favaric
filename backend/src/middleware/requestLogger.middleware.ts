import morgan from "morgan";
import fs from "fs";
import path from "path";

const logsDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const accessLogStream = fs.createWriteStream(
    path.join(logsDir, "requests.log"),
    {
        flags: "a",
    }
);

const requestLogger = morgan(
    "[:date[iso]] :remote-addr :method :url :status :response-time ms",
    {
        stream: accessLogStream,
    }
);

export default requestLogger;