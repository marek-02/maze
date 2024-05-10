import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'

import { getHeroName } from '../../../utils/constants'
import { HeroType } from '../../../utils/userRole'

export const ASC = 'ASC'
export const DESC = 'DESC'

export const incorrectSortedVariables = ['test', null, undefined, 0, {}, true]
export const incorrectArrayItemValues = ['test', null, undefined, 0, [], true]
export const incorrectOptionsValues = ['test', null, 0, [], true]

export const incorrectArrays = [[], {}, null, undefined, 'test', 12, true]

export const iconsData = [
  {
    order: ASC,
    expectedIcon: faArrowUp,
    nextOrder: DESC
  },
  {
    order: DESC,
    expectedIcon: faArrowDown,
    nextOrder: ASC
  },
  {
    order: 'wrongString',
    expectedIcon: faArrowDown,
    nextOrder: ASC
  }
]

export const arrayToSort = [
  {
    firstName: 'Jan',
    lastName: 'Nowak',
    position: 1,
    heroType: HeroType.UNFORTUNATE,
    foo: 'test1'
  },
  {
    firstName: 'Tomasz',
    lastName: 'Kowal',
    position: 4,
    heroType: HeroType.UNFORTUNATE,
    foo: 'test2'
  },
  {
    firstName: 'Lucek',
    lastName: 'Kwiatek',
    position: 2,
    heroType: HeroType.SHEUNFORTUNATE,
    foo: 'test3'
  },
  {
    firstName: 'Łukasz',
    lastName: 'Baran',
    position: 3,
    heroType: HeroType.UNFORTUNATE,
    foo: 'test4'
  }
]

export const expectedSortedArray = [
  {
    sortingBy: ['firstName', 'lastName'],
    order: ASC,
    options: { isString: true },
    sortedArray: [
      {
        firstName: 'Jan',
        lastName: 'Nowak',
        position: 1,
        heroType: HeroType.UNFORTUNATE,
        foo: 'test1'
      },
      {
        firstName: 'Lucek',
        lastName: 'Kwiatek',
        position: 2,
        heroType: HeroType.SHEUNFORTUNATE,
        foo: 'test3'
      },
      {
        firstName: 'Łukasz',
        lastName: 'Baran',
        position: 3,
        heroType: HeroType.UNFORTUNATE,
        foo: 'test4'
      },
      {
        firstName: 'Tomasz',
        lastName: 'Kowal',
        position: 4,
        heroType: HeroType.UNFORTUNATE,
        foo: 'test2'
      }
    ]
  },
  {
    sortingBy: ['position'],
    order: DESC,
    options: { isString: false },
    sortedArray: [
      {
        firstName: 'Tomasz',
        lastName: 'Kowal',
        position: 4,
        heroType: HeroType.UNFORTUNATE,
        foo: 'test2'
      },
      {
        firstName: 'Łukasz',
        lastName: 'Baran',
        position: 3,
        heroType: HeroType.UNFORTUNATE,
        foo: 'test4'
      },
      {
        firstName: 'Lucek',
        lastName: 'Kwiatek',
        position: 2,
        heroType: HeroType.SHEUNFORTUNATE,
        foo: 'test3'
      },
      {
        firstName: 'Jan',
        lastName: 'Nowak',
        position: 1,
        heroType: HeroType.UNFORTUNATE,
        foo: 'test1'
      }
    ]
  },
  {
    sortingBy: ['heroType'],
    order: ASC,
    options: { isString: true, customComparingFunction: getHeroName },
    sortedArray: [
      {
        firstName: 'Tomasz',
        lastName: 'Kowal',
        position: 4,
        heroType: HeroType.UNFORTUNATE,
        foo: 'test2'
      },
      {
        firstName: 'Łukasz',
        lastName: 'Baran',
        position: 3,
        heroType: HeroType.UNFORTUNATE,
        foo: 'test4'
      },
      {
        firstName: 'Lucek',
        lastName: 'Kwiatek',
        position: 2,
        heroType: HeroType.SHEUNFORTUNATE,
        foo: 'test3'
      },
      {
        firstName: 'Jan',
        lastName: 'Nowak',
        position: 1,
        heroType: HeroType.UNFORTUNATE,
        foo: 'test1'
      }
    ]
  }
]
