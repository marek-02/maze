import React, { useEffect, useState } from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'

import GameCard from './GameCard'
import GameCardAchiever from './GameCardTypes/GameCardAchiever'
import GameCardExplorer from './GameCardTypes/GameCardExplorer'
import GameCardKiller from './GameCardTypes/GameCardKiller'
import GameCardSocializer from './GameCardTypes/GameCardSocializer'
import {
  GradesStatsContent,
  HeroStatsContent,
  LastActivitiesContent,
  PersonalRankingInfoContent,
  SearchOthersStatsContent,
  SubmitStatsContent,
  PersonalOverallRankingInfoContent,
  KillerAuctionsContent,
  AchieverAuctionsContent,
  ColloquiumStatsContent
} from './gameCardContents'
import { useAppSelector } from '../../../hooks/hooks'
import StudentService from '../../../services/student.service'
import { ERROR_OCCURRED, PASSWORD_VALIDATION_ERROR, getPersonalityName } from '../../../utils/constants'
import Loader from '../../general/Loader/Loader'
import { useGetPersonalityQuery, useSendPersonalityQuizResultsMutation } from '../../../api/apiPersonality'

function GameCardView(props) {
  const [dashboardStats, setDashboardStats] = useState(undefined)
  const courseId = useAppSelector((state) => state.user.courseId)

  const [selectedUserId,setSelectedUserId] = useState(-1)
  const [selectedUsersDashboardStats,setSelectedUsersDashboardStats] = useState(undefined)
  
  const { data: studentPersonality, isSuccess } = useGetPersonalityQuery()

  const [members,setMembers] = useState(undefined)

  useEffect(() => {
    StudentService.getDashboardStats(courseId)
      .then((response) => {
        setDashboardStats(response)
        localStorage.setItem('heroType', response.heroTypeStatsDTO.heroType)
      })
      .catch(() => setDashboardStats(null))
  }, [])

  useEffect(() => {
    if(selectedUserId===-1) return
    StudentService.getSpecifiedStudentsDashboardStats(selectedUserId,courseId)
    .then((response) => {
      setSelectedUsersDashboardStats(response)
      localStorage.setItem('heroType', response?.heroTypeStatsDTO?.heroType)
    })
    .catch(((err) => {
      console.log(err)
      setSelectedUsersDashboardStats(null)
    }))
  },[selectedUserId])

  useEffect(() => {
    StudentService.getAllMembers(courseId)
    .then((response) => {
      setMembers(response)
    })
    .catch(((err) => {
      console.log(err)
      setMembers(null)
    }
  ))
  },[])

  useEffect(() => {}, [studentPersonality])

  function getCardByPersonality() {
    const currentPersonality = Object.entries(studentPersonality).reduce(
      (maxEntry, currentEntry) => (currentEntry[1] > maxEntry[1] ? currentEntry : maxEntry)
    )[0]
    console.log(currentPersonality);
    if (currentPersonality == "EXPLORER")
      return <GameCardExplorer props={props}></GameCardExplorer> 
    if (currentPersonality == "KILLER")
      return <GameCardKiller props={props}></GameCardKiller>
    if (currentPersonality == "SOCIALIZER")
      return <GameCardSocializer props={props}></GameCardSocializer>
    return <GameCardAchiever props={props}></GameCardAchiever>
  }
  

  // console.log(Object.entries(studentPersonality).reduce(
  //   (maxEntry, currentEntry) => (currentEntry[1] > maxEntry[1] ? currentEntry : maxEntry)
  // )[0]);

  return (
    <Container>
      {dashboardStats === undefined ? (
        <Loader />
      ) : dashboardStats == null ? (
        <p className='text-danger'>{ERROR_OCCURRED}</p>
      ) : (
        <>
          {
            getCardByPersonality()
          }
        </>
      )}
    </Container>
  )
}

function mapStateToProps(state) {
  const { theme } = state

  return { theme }
}

export default connect(mapStateToProps)(GameCardView)
