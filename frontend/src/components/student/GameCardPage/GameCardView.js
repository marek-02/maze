import React, { useEffect, useState } from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'

import GameCard from './GameCard'
import {
  GradesStatsContent,
  HeroStatsContent,
  LastActivitiesContent,
  PersonalRankingInfoContent,
  SearchOthersStatsContent
} from './gameCardContents'
import { useAppSelector } from '../../../hooks/hooks'
import StudentService from '../../../services/student.service'
import { ERROR_OCCURRED } from '../../../utils/constants'
import Loader from '../../general/Loader/Loader'

function GameCardView(props) {
  const [dashboardStats, setDashboardStats] = useState(undefined)
  const courseId = useAppSelector((state) => state.user.courseId)

  const [selectedUserId,setSelectedUserId] = useState(-1)
  const [selectedUsersDashboardStats,setSelectedUsersDashboardStats] = useState(undefined)

  useEffect(() => {
    StudentService.getDashboardStats(courseId)
      .then((response) => {
        setDashboardStats(response)
        localStorage.setItem('heroType', response.heroTypeStatsDTO.heroType)
      })
      .catch(() => setDashboardStats(null))
  }, [])

  useEffect(() => {
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


  const changeSelectedUserId = (newUserId) => {
    console.log(`Invoked changeSelectedUserId: ${newUserId}`)
    console.log(selectedUsersDashboardStats)
    setSelectedUserId(newUserId)
  }

  return (
    <Container>
      {dashboardStats === undefined ? (
        <Loader />
      ) : dashboardStats == null ? (
        <p className='text-danger'>{ERROR_OCCURRED}</p>
      ) : (
        <>
          <Row className='m-0 gy-2'>
            <Col md={5}>
              <GameCard
                headerText='Statystyki bohatera'
                content={
                  <HeroStatsContent
                    stats={dashboardStats.heroStatsDTO}
                    heroType={dashboardStats.heroTypeStatsDTO.heroType}
                  />
                }
              />
            </Col>
            <Col md={7}>
              <GameCard
                headerText='Statystyki ocen'
                content={<GradesStatsContent stats={dashboardStats.generalStats} />}
              />
            </Col>
          </Row>
          <Row className='m-0 mb-5 m-md-0 pt-3'>
            <Col md={5}>
              <GameCard
                headerText='Podgląd statystyk innego gracza'
                content={<SearchOthersStatsContent stats={selectedUsersDashboardStats?.heroStatsDTO} handler={changeSelectedUserId}/>}
              />
            </Col>
            <Col md={7}>
              <GameCard
                headerText='Ostatnio dodane aktywności'
                content={<LastActivitiesContent theme={props.theme} stats={dashboardStats.lastAddedActivities} />}
              />
            </Col>
          </Row>
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
