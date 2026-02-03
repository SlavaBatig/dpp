import debugWrapper from "debugjs-wrapper";

import { fetchPlayerHeroes } from "./heroes.js";
import Constants from "./constants.js";
import { LEVELS } from "./levels.js";
import { HEROES } from "./heroes.js";

const { debug } = debugWrapper.all("dota:processor");

/**
 *
 * @param {Array<{[id]: {string, games: number, wins: number, isTurbo: boolean}}>} data
 * @returns {<Array<{name: string, level: number, img: string, badge: string}>}
 */
const calculate = (data) => {
  const results = [];

  for (const id in HEROES) {
    const { name, img } = HEROES[id];

    let totalExp = 0;

    data.forEach((set) => {
      if (!set[id]) {
        debug(
          `Player ${id} does not have hero ${id}, set is empty ${JSON.stringify(set)}`,
        );
      }
      const { games, wins, isTurbo } = set[id];

      totalExp += isTurbo
        ? (games + wins) * Constants.EXP_TURBO
        : (games + wins) * Constants.EXP_NORMAL;
      totalExp += isTurbo
        ? (wins / Constants.WINS_FOR_CHALLENGE) * Constants.CHALLENGE_EXP_TURBO
        : (wins / Constants.WINS_FOR_CHALLENGE) *
          Constants.CHALLENGE_EXP_NORMAL;
    });

    let level, badge;

    for (let i = 0; i < LEVELS.length; i++) {
      if (i === 30) {
        level = i;
        badge = Constants[LEVELS[i].badge];
        break;
      }

      if (totalExp >= LEVELS[i].exp && totalExp < LEVELS[i + 1].exp) {
        level = i;
        badge = Constants[LEVELS[i].badge];
        break;
      }
    }

    results.push({
      name,
      level,
      img: `${Constants.BASE_URL_ICONS}${img}`,
      badge,
    });
  }

  return results.sort((a, b) => {
    if (a.level > b.level) {
      return -1;
    }
    if (a.level < b.level) {
      return 1;
    }
    return 0;
  });
};

/**
 *
 * @param {Array<string>} ids
 * @param {Array<string>} modes
 * @returns {Promise<Array<{name: string, level: number, img: string, badge: string}>>}
 */
const processor = async (ids, modes) => {
  debug(`Procssing players: ${ids} for modes: ${modes}`);

  const promises = [];

  let action;

  if (modes.some((mode) => mode === Constants.MODE_ALL_NORMAL)) {
    action = Constants.MODE_ALL_NORMAL;
  }

  if (modes.some((mode) => mode === Constants.MODE_ALL)) {
    action = Constants.MODE_ALL;
  }

  ids.forEach((id) => {
    switch (action) {
      case Constants.MODE_ALL:
        promises.push(fetchPlayerHeroes(id, null));
        promises.push(fetchPlayerHeroes(id, Constants.MODE_TURBO));
        break;
      case Constants.MODE_ALL_NORMAL:
        promises.push(fetchPlayerHeroes(id, null));
        break;
      default:
        modes.forEach((mode) => {
          promises.push(fetchPlayerHeroes(id, mode));
        });
        break;
    }
  });
  return calculate(await Promise.all(promises));
};

export default processor;
