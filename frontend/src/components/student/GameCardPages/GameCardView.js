import { useEffect } from 'react'

import { connect } from 'react-redux'

import GameCardAchiever from './GameCardTypes/GameCardAchiever'
import GameCardExplorer from './GameCardTypes/GameCardExplorer'
import GameCardKiller from './GameCardTypes/GameCardKiller'
import GameCardSocializer from './GameCardTypes/GameCardSocializer'
import { useGetPersonalityQuery } from '../../../api/apiPersonality'

function GameCardView(props) {
  const { data: studentPersonality } = useGetPersonalityQuery()

  useEffect(() => {}, [studentPersonality])

  function getCardByPersonality() {
    if (Object.keys(studentPersonality).length === 0)
      return <GameCardKiller props={props}></GameCardKiller>

    const currentPersonality = Object.entries(studentPersonality).reduce(
      (maxEntry, currentEntry) => (currentEntry[1] > maxEntry[1] ? currentEntry : maxEntry)
    )[0]

    //let currentPersonality = "ACHIEVER"
    
    if (currentPersonality == "EXPLORER")
      return <GameCardExplorer props={props}></GameCardExplorer> 
    if (currentPersonality == "KILLER")
      return <GameCardKiller props={props}></GameCardKiller>
    if (currentPersonality == "SOCIALIZER")
      return <GameCardSocializer props={props}></GameCardSocializer>
    return <GameCardAchiever props={props}></GameCardAchiever>
  }

  return getCardByPersonality()
}

function mapStateToProps(state) {
  const { theme } = state

  return { theme }
}

export default connect(mapStateToProps)(GameCardView)
