import { request } from 'undici'

const performRequest = async url => {
  const { body } = await request(url)

  return await body.json()
}

export default performRequest