import { useEffect, useState } from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'

import GameCard from '../GameCard'
import {
  GradesStatsContent,
  HeroStatsContent,
  PersonalRankingInfoContent,
  SearchOthersStatsContent,
  SubmitStatsContent,
} from '../gameCardContents'
import { useAppSelector } from '../../../../hooks/hooks'
import StudentService from '../../../../services/student.service'
import { ERROR_OCCURRED } from '../../../../utils/constants'
import Loader from '../../../general/Loader/Loader'

function GameCardSocializer(props) {
  const [dashboardStats, setDashboardStats] = useState(undefined)
  const courseId = useAppSelector((state) => state.user.courseId)

  const [selectedUserId,setSelectedUserId] = useState(-1)
  const [selectedUsersDashboardStats,setSelectedUsersDashboardStats] = useState(undefined)

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
      //localStorage.setItem('someones_heroType', response?.heroTypeStatsDTO?.heroType)
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

  const changeSelectedUserId = (newUserId) => {
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
                    stats={dashboardStats.heroStatsDTO} heroType = {localStorage.getItem('heroType')}
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
                  headerText='Statystyki zausznika'
                  content={<SubmitStatsContent stats={dashboardStats.submitStats} />}
              />
            </Col>
            <Col md={7}>
              <GameCard
                headerText='Podgląd statystyk innego gracza'
                content={<SearchOthersStatsContent stats={selectedUsersDashboardStats?.heroStatsDTO} members={members}
                  heroType={selectedUsersDashboardStats?.heroTypeStatsDTO.heroType} handler={changeSelectedUserId}/>}
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

export default connect(mapStateToProps)(GameCardSocializer)