import request from './request.js'
import Constants from './constants.js'
import { readFile, saveFile } from './fs.js'

const HEROES = {}

const prepareHeroes = async () => {
  let heroes = await readFile('heroes')

  if (!heroes) {
    heroes = await request(`${Constants.BASE_URL_OD}/heroStats`)

    heroes.forEach(hero => {
      const { id, img, localized_name } = hero
      HEROES[id] = {
        name: localized_name,
        img
      }
    })

    await saveFile(Constants.FILENAME_HEROES, JSON.stringify(HEROES))
  } else {
    for (const id in heroes) {
      HEROES[id] = {
        ...heroes[id]
      }
    }
  }
}

/**
 * 
 * @param {string} id 
 * @param {string} mode 
 * @returns {{[id]: {games: number, wins: number, isTurbo: boolean}}}
 */
const fetchPlayerHeroes = async (id, mode) => {
  const result = await request(`${Constants.BASE_URL_OD}/players/${id}/heroes?${mode ? `game_mode=${mode}&significant=0` : ''}`)

  const heroes = {}

  result.forEach(hero => {
    heroes[hero.hero_id] = {
      games: hero.games,
      wins: hero.win,
      isTurbo: mode == Constants.MODE_TURBO
    }
  })

  return heroes
}

export {
  HEROES,
  prepareHeroes,
  fetchPlayerHeroes
}