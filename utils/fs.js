import fs from 'fs/promises'

import Constants from './constants.js'

const readFile = async name => {
  try {
    return JSON.parse((await fs.readFile(`./${name}.json`)).toString())
  } catch (err) {
    if (err.code === Constants.NO_FILE) {
      return
    }
    throw err
  }
}

const saveFile = async (name, data) => {
  await fs.writeFile(`./${name}.json`, data)
}

export {
  readFile,
  saveFile
}