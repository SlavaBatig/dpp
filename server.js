import Fastify from "fastify"
import debugWrapper from 'debugjs-wrapper'
import ejs from 'ejs'

import { processor } from "./utils/index.js"

const { debug, error } = debugWrapper.all('dota:server')

const PORT = process.env.PORT || 3000

const fastify = Fastify()

fastify.register(import('@fastify/view'), {
  engine: {
    ejs
  }
})

fastify.get('/', (req, res) => {
  res.view('/views/index.ejs')
})

fastify.post('/process', async (req, res) => {
  const { body: { players, modes } } = req

  res.type('application/json', { test: true })

  try {
    const result = await processor(players, modes)
    res.code(200)
    return { result }
  } catch (err) {
    error('Failed proceissing', err)
    res.code(err.statusCode || 500)
    return { error: err.message }
  }
})

const start = async () => {
  await fastify.listen({ port: PORT })
  debug(`Server is listening at ${PORT}`)
}

export default start