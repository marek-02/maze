import { useEffect, useState } from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'


import GameCard from '../GameCard'
import {
  GradesStatsContent,
  PersonalRankingInfoContent,
  SubmitStatsContent,
  AchieverAuctionsContent,
  LastActivitiesContent
} from '../gameCardContents'
import StudentService from '../../../../services/student.service'
import { useAppSelector } from '../../../../hooks/hooks'
import { ERROR_OCCURRED } from '../../../../utils/constants'
import Loader from '../../../general/Loader/Loader'

function GameCardExplorer(props) {
  const [dashboardStats, setDashboardStats] = useState(undefined)
  const courseId = useAppSelector((state) => state.user.courseId)
  
  useEffect(() => {
    StudentService.getDashboardStats(courseId)
      .then((response) => {
        setDashboardStats(response)
        localStorage.setItem('heroType', response.heroTypeStatsDTO.heroType)
      })
      .catch(() => setDashboardStats(null))
  }, [])

//   console.log("WSZYSTKIE DASHBOARDY")
//   console.log(dashboardStats)

  return (
    <Container>
      {dashboardStats === undefined ? (
        <Loader />
      ) : dashboardStats == null ? (
        <p className='text-danger'>{ERROR_OCCURRED}</p>
      ) : (
        <>
          <Row className='m-0 gy-2'>
            <Col md={6}>
              <GameCard
                headerText='Statystyki ocen'
                content={
                  <GradesStatsContent
                    stats={dashboardStats.generalStats}
                  />
                }
              />
            </Col>
            <Col md={6}>
              <GameCard
                headerText='Licytacje'
                content={<AchieverAuctionsContent stats={dashboardStats.auctionStats} />}
              />
            </Col>
          </Row>
          <Row className='m-0 gy-2'>
            <Col md={5}>
              <GameCard
                  headerText='Statystyki zausznika'
                  content={<SubmitStatsContent stats={dashboardStats.submitStats} />}
              />
            </Col>
            <Col md={7}>
              <GameCard
                headerText='Ostatnio dodane aktywności'
                content={
                  <LastActivitiesContent
                    stats={dashboardStats.lastAddedActivities} theme={props.theme}
                  />
                }
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

export default connect(mapStateToProps)(GameCardExplorer)