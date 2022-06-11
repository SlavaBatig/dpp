import debugWrapper from 'debugjs-wrapper'

import { HeroesUtil, LevelsUtil } from './utils/index.js'
import server from './server.js'

const { debug, error } = debugWrapper.all('dota:index')

const start = async () => {
  try {
    debug('Preparing herores')
    await HeroesUtil.prepareHeroes()
    debug('Prepared heroes')
  } catch (err) {
    error('Failed preparing heroes', err)
    return
  }

  try {
    debug('Preparing levels')
    await LevelsUtil.prepareLevels()
    debug('Prepared levels')
  } catch (err) {
    error('Failed preparing levels', err)
    return
  }

  try {
    await server()
  } catch (err) {
    error('Failed starting server', err)
  }
}

start()