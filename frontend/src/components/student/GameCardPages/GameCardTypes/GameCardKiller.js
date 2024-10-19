import { useEffect, useState } from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'


import GameCard from '../GameCard'
import {
  GradesStatsContent,
  PersonalRankingInfoContent,
  PersonalOverallRankingInfoContent,
  HeroStatsContent,
  KillerAuctionsContent,
  KillerHeroStatsContent
} from '../gameCardContents'
import { useAppSelector } from '../../../../hooks/hooks'
import StudentService from '../../../../services/student.service'
import { ERROR_OCCURRED } from '../../../../utils/constants'
import Loader from '../../../general/Loader/Loader'


function GameCardKiller(props) {
  const [dashboardStats, setDashboardStats] = useState(undefined)
  const courseId = useAppSelector((state) => state.user.courseId)


  useEffect(() => {
    StudentService.getDashboardStats(courseId)
      .then((response) => {
        setDashboardStats(response)
        localStorage.setItem('heroType', response.heroTypeStatsDTO.heroType)
        // console.log(response);
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
            <Col md={6}>
              <GameCard
                headerText='Statystyki bohatera'
                content={
                  <KillerHeroStatsContent
                    stats={dashboardStats.heroStatsDTO} heroType = {localStorage.getItem('heroType')} heroTypeStats={dashboardStats.heroTypeStatsDTO}
                  />
                }
              />
            </Col>
            <Col md={6}>
              <GameCard
                headerText='Licytacje'
                content={<KillerAuctionsContent stats={dashboardStats.auctionStats} />}
              />
            </Col>
          </Row>
          <Row className='m-0 mb-5 m-md-0 pt-3'>
          <Col md={6}>
              <GameCard
                headerText='Ranking roczny'
                content={
                  <PersonalRankingInfoContent
                    stats={{
                      rankPosition: dashboardStats.heroTypeStatsDTO.rankPosition,
                      rankLength: dashboardStats.heroTypeStatsDTO.rankLength,
                      userPoints: Math.floor( dashboardStats.heroTypeStatsDTO.userPoints ),
                      betterPlayerPoints: dashboardStats.heroTypeStatsDTO.betterPlayerPoints,
                      worsePlayerPoints: dashboardStats.heroTypeStatsDTO.worsePlayerPoints,
                      ranking: dashboardStats.heroTypeStatsDTO.ranking,
                      userPoints: Math.floor( dashboardStats.generalStats.allPoints )
                    }} 
                    email={dashboardStats.email}
                    id={"year"}
                    theme={props.theme}
                  />
                  }
                />
            </Col>
            <Col md={6}>
              <GameCard
                headerText='Ranking wszechczasów'
                content={
                  <PersonalRankingInfoContent
                    stats={{
                      rankPosition: dashboardStats.heroTypeStatsDTO.overallRankPosition,
                      rankLength: dashboardStats.heroTypeStatsDTO.overallRankLength,
                      userPoints: dashboardStats.heroTypeStatsDTO.userPoints,
                      betterPlayerPoints: dashboardStats.heroTypeStatsDTO.betterPlayerPointsOverall,
                      worsePlayerPoints: dashboardStats.heroTypeStatsDTO.worsePlayerPointsOverall,
                      ranking: dashboardStats.heroTypeStatsDTO.overallRanking,
                      userPoints: dashboardStats.generalStats.allPoints
                    }}
                    email={dashboardStats.email}
                    id={"overall"}
                    theme={props.theme}
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

export default connect(mapStateToProps)(GameCardKiller)
