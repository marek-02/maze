import { useEffect, useState } from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'


import GameCard from '../GameCard'
import {
  GradesStatsContent,
  PersonalRankingInfoContent,
  AchieverAuctionsContent,
  HeroStatsContent,
  CollectiblesInfoContent
} from '../gameCardContents'
import { useAppSelector } from '../../../../hooks/hooks'
import StudentService from '../../../../services/student.service'
import RankService from '../../../../services/rank.service'
import ActivityService from '../../../../services/activity.service'
import { ERROR_OCCURRED } from '../../../../utils/constants'
import Loader from '../../../general/Loader/Loader'
import UserService from '../../../../services/user.service'
import { ActivityImg } from '../../AllActivities/ExpeditionTask/ActivityInfo/ActivityInfoStyles'

function GameCardAchiever(props) {
  const [dashboardStats, setDashboardStats] = useState(undefined)
  const courseId = useAppSelector((state) => state.user.courseId)
  const [allBadgesList, setAllBadgesList] = useState(undefined)
  const [unlockedBadgesList, setUnlockedBadgesList] = useState(undefined)
  const [allRanksList, setAllRanksList] = useState(undefined)
  const [currentRank, setCurrentRank] = useState(undefined)
  const [currentRankNr,setCurrentRankNr] = useState(undefined)
  const [heroType, setHeroType] = useState(undefined)
  const [allActivitiesNr, setAllActivitiesNr] = useState(undefined)

  useEffect(() => {
    StudentService.getDashboardStats(courseId)
      .then((response) => {
        setDashboardStats(response)
        localStorage.setItem('heroType', response.heroTypeStatsDTO.heroType)
        setHeroType(response.heroTypeStatsDTO.heroType)
      })
      .catch(() => setDashboardStats(null))

    UserService.getAllBadges(courseId)
          .then((response) => {
              setAllBadgesList(response)
          })
          .catch(() => {
              setAllBadgesList(null)
          })
  
    UserService.getUnlockedBadges(courseId)
        .then((response) => {
            setUnlockedBadgesList(response)
        })
        .catch(() => {
            setUnlockedBadgesList(null)
        })

    RankService.getAllRanks(courseId)
    .then((response) => {
      setAllRanksList(response)
    })
    .catch(() => {
      setAllRanksList(null)
    })

    RankService.getCurrentStudentRank(courseId)
    .then((response) => {
      setCurrentRank(response.currentRank.name)
    })
    .catch(() => {
      setCurrentRank(null)
    })        

    ActivityService.getActivitiesList(courseId) //To trzeban pozniej na spokojnie naprawic bo liczy tylko aktualne aktywnosci a nie wszystkie
    .then((response) => {
      setAllActivitiesNr(response.length)
    })
    .catch(() => {
      setAllActivitiesNr(null)
    })        
  
  }, [])

  useEffect(() => {
    if(heroType == undefined || currentRank == undefined || allRanksList == undefined) return;

    let allRanksForHeroType = allRanksList[heroType === "SHEUNFORTUNATE"? 0 : 1 ]["ranks"];

    for(let i =0 ; i<allRanksForHeroType.length; i++){
      console.log(allRanksForHeroType[i].name)
      if(allRanksForHeroType[i].name === currentRank){
        setCurrentRankNr(i+1);
      }
    }

  },[currentRank,heroType,allRanksList])

  


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
                headerText='Informacje kolekcjonerskie'
                content={
                  <CollectiblesInfoContent 
                    allBadgesNr = {allBadgesList?.length} unlockedBadgesNr = {unlockedBadgesList?.length}
                    allRanksNr = {allRanksList[localStorage.getItem('heroType') === "SHEUNFORTUNATE"? 0 : 1 ]["ranks"]?.length}  
                    currentRankNr = {currentRankNr}
                    allActivitiesNr = {allActivitiesNr}
                    completedActivitiesNr = {dashboardStats.heroStatsDTO.completedActivities}
                    // stats={dashboardStats.heroStatsDTO}
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
