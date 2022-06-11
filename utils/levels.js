import { readFile } from './fs.js'
import Constants from './constants.js'

const LEVELS = []

const prepareLevels = async () => {
  const levels = await readFile(Constants.FILENAME_LEVELS)
  for (const level of levels) {
    LEVELS.push(level)
  }
}

export {
  LEVELS,
  prepareLevels
}