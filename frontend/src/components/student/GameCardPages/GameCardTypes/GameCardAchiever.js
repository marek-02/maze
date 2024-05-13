import { useEffect, useState } from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'


import GameCard from '../GameCard'
import {
  GradesStatsContent,
  PersonalRankingInfoContent,
  AchieverAuctionsContent
} from '../gameCardContents'
import { useAppSelector } from '../../../../hooks/hooks'
import StudentService from '../../../../services/student.service'
import { ERROR_OCCURRED } from '../../../../utils/constants'
import Loader from '../../../general/Loader/Loader'

function GameCardAchiever(props) {
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
                    <GradesStatsContent
                        stats={dashboardStats.heroStatsDTO}
                    />
                    }
                />
            </Col>
            <Col md={7}>
              <GameCard
                  headerText='Miejsce w rankingu'
                  content={
                    <PersonalRankingInfoContent
                      stats={{
                        ...dashboardStats.heroTypeStatsDTO,
                        userPoints: dashboardStats.generalStats.allPoints
                      }}
                    />
                  }
                />
            </Col>
          </Row>
          <Row className='m-0 gy-2'>
            <Col md={5}>
              <GameCard
                headerText='Statystyki bohatera'
                content={
                  <GradesStatsContent
                    stats={dashboardStats.heroStatsDTO}
                  />
                }
              />
            </Col>
            <Col md={7}>
            <GameCard
                headerText='Licytacje'
                content={<AchieverAuctionsContent stats={dashboardStats.auctionStats} />}
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

export default connect(mapStateToProps)(GameCardAchiever)
