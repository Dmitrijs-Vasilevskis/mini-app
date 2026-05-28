import { server } from "./app.config"

const PORT = Number(process.env.PORT) || 2567;

server.listen(PORT);