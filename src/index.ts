import getEnv from "./helpers/getEnv"
import server from "./server"

const PORT = getEnv('PORT', 4000)

server.listen(PORT, () => {
  console.log(`Server listening at localhost:${PORT}`)
})