import React, {useState,useEffect} from 'react'

import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js'
import moment from 'moment'
import { Col, Row } from 'react-bootstrap'
import { Bar, Pie } from 'react-chartjs-2'

import { ChartCol, CustomTable } from './gameCardContentsStyle'
import { barConfig, pieConfig } from '../../../utils/chartConfig'
import {
  convertHeroTypeToPlayerType,
  getActivityTypeName,
  getGameCardInfo,
  BidImg,
  HeroImg,
  CoinImg
} from '../../../utils/constants'
import { isMobileView } from '../../../utils/mobileHelper'
import { PlayerType } from '../../../utils/userRole'
import { colorPalette } from '../../general/chartHelper'
import PercentageCircle from '../PointsPage/ChartAndStats/PercentageCircle'

export function GradesStatsContent(props) {
  const {
    allPoints = 0,
    maxPoints = 0,
    avgGraphTask = 0,
    avgFileTask = 0,
    surveysNumber = 0,
    graphTaskPoints = 0,
    fileTaskPoints = 0
  } = props.stats
  const percentageValue = allPoints && maxPoints ? Math.round(100 * (allPoints / maxPoints)) : 0

  return (
    <Row className='h-100 d-flex justify-content-center align-items-center'>
      <Col md={7} style={{width:"58%"}}>
        <p className='pb-3'>Średnia (Ekspedycje):{avgGraphTask ?? 0}%</p>
        <p className='pb-3'>Średnia (Zadania bojowe):{avgFileTask ?? 0}%</p>
        <p className='pb-3'>Ilość wykonanych sondaży:{surveysNumber}</p>
        <p className='pb-3'>Punkty (Ekspedycje):{graphTaskPoints}</p>
        <p className='pb-3'>Punkty (Zadania bojowe):{fileTaskPoints}</p>
      </Col>
      <Col md={5}>
        <PercentageCircle percentageValue={percentageValue} points={allPoints} maxPoints={maxPoints} />
      </Col>
    </Row>
  )
}

export function LastActivitiesContent(props) {
  return (
    <CustomTable $fontColor={props.theme.font} $borderColor={props.theme.primary} $background={props.theme.secondary}>
      <thead>
        <tr>
          <th>Rozdział</th>
          <th>Aktywność</th>
          <th>Punkty</th>
          <th>Dostępne do</th>
        </tr>
      </thead>
      <tbody>
        {props.stats.map((activity, index) => (
          <tr key={index + Date.now()}>
            <td>{activity.chapterName}</td>
            <td>{getActivityTypeName(activity.activityType)}</td>
            <td>{activity.points}</td>
            <td>
              {activity.availableUntil ? moment(activity.availableUntil).format('DD.MM.YYYY') : 'Bez limitu czasowego'}
            </td>
          </tr>
        ))}
      </tbody>
    </CustomTable>
  )
}

export function HeroStatsContent(props) {

  return (
    <Row
      className={`h-100 d-flex justify-content-center align-items-center ${
        isMobileView() ? 'flex-column' : 'flex-row'
      }`}
    >
      <Col md={4} className='h-100'>
        <img style={{ maxWidth: '100%' }} height='90%' src={HeroImg[props.heroType]} alt='Your hero' />
      </Col>
      <Col md={7}>

        <p className='pb-1'>Punkty doświadczenia: {props.stats.experiencePoints}</p>
        <p className='pb-1'>Punkty do kolejnej rangi: {props.stats.nextLvlPoints!=null ? props.stats.nextLvlPoints : "Brak"}</p>
        <p className='pb-1'>Ranga: {props.stats.rankName}</p>
        <p className='pb-1'>Zdobyte glejty: {props.stats.badgesNumber}</p>
        <p>Wykonanych aktywności: {props.stats.completedActivities}</p>
      </Col>
    </Row>
  )
}

export function KillerHeroStatsContent(props) {

  let betterPlayerPts = props.heroTypeStats.betterPlayerPoints==null ? "Jesteś #1" : props.heroTypeStats.betterPlayerPoints
  return (
    <Row
      className={`h-100 d-flex justify-content-center align-items-center ${
        isMobileView() ? 'flex-column' : 'flex-row'
      }`}
    >
      <Col md={4} className='h-100'>
        <img style={{ maxWidth: '100%' }} height='90%' src={HeroImg[props.heroType]} alt='Your hero' />
      </Col>
      <Col md={7}>

        <p className='pb-1'>Punkty doświadczenia: {props.stats.experiencePoints}</p>
        <p className='pb-1'>Punkty do kolejnej rangi: {props.stats.nextLvlPoints!=null ? props.stats.nextLvlPoints : "MAX"}</p>
        <p className='pb-1'>Ranga: {props.stats.rankName}</p>
        <p className='pb-1'>Zdobyte glejty: {props.stats.badgesNumber}</p>
        <p className='pb-1'>Punkty rywala: {betterPlayerPts}</p>
      </Col>
    </Row>
  )
}


export function SearchOthersStatsContent(props){
    // const [userId,setUserId] = useState(0)
    const [selectedMemberId, setSelectedMemberId] = useState(1)

    useEffect(() => {
      props.handler(selectedMemberId)
    },[selectedMemberId])

    return (
      <Row
        className={`h-100 d-flex justify-content-center align-items-center ${
          isMobileView() ? 'flex-column' : 'flex-row'
        }`}
      >
        <Col md={4} className='h-100'>
          <img style={{ maxWidth: '100%' }} height='90%' src={HeroImg[props.heroType]} alt='Your hero' />
        </Col>
        <Col md={7}>
          <select id="selectMember" value={selectedMemberId} onChange={(event) => {setSelectedMemberId(event.target.value)}}>
            {
                props?.members?.map((member) => <option key={member?.id} value={member?.id}>{`${member?.firstName} ${member?.lastName}`}</option>)
            }
          </select>
          {/* <button onClick={() => props.handler(userId)}>Szukaj</button> */}
          <p className='pb-1'>Punkty doświadczenia: {props?.stats?.experiencePoints}</p>
          <p className='pb-1'>Punkty do kolejnej rangi: {props?.stats?.nextLvlPoints}</p>
          <p className='pb-1'>Ranga: {props?.stats?.rankName}</p>
          <p className='pb-1'>Zdobytych medali: {props?.stats?.badgesNumber}</p>
          <p>Wykonanych aktywności: {props?.stats?.completedActivities}</p>
        </Col>
      </Row>
    )
}

export function SubmitStatsContent(props) {
  const {
    submitTaskResultCount = 0,
    fileTaskResultCount = 0,
    submitPoints = 0
  } = props.stats
  const percentageValue = fileTaskResultCount && submitTaskResultCount ? Math.round(100 * (fileTaskResultCount / submitTaskResultCount)) : 0

  return (
    <Row className='h-100 d-flex justify-content-center align-items-center'>
      <Col md={5} style={{width:"auto"}}>
        <p className='pb-3'>Złożone propozycje: {submitTaskResultCount}</p>
        <p className='pb-3'>Przyjęte propozycje: {fileTaskResultCount}</p>
        <p className='pb-3'>Zdobyte punkty: {submitPoints}</p>
      </Col>
      <Col md={5}>
        <PercentageCircle percentageValue={percentageValue} points={fileTaskResultCount} maxPoints={submitTaskResultCount} />
      </Col>
    </Row>
  )
}
export function KillerAuctionsContent(props) {
  const {
    auctionsWon = 0,
    auctionsResolvedCount = 0,
    auctionRanking = 0,
    bestAuctioner
  } = props.stats

  return (
      <Row
          className={`h-100 d-flex justify-content-center align-items-center ${
              isMobileView() ? 'flex-column' : 'flex-row'
          }`}
      >
        <Col md={4} className='h-100'>
          <img style={{ maxWidth: '100%' }} height='90%' src={BidImg} alt='Bid image' />
        </Col>
        <Col md={7}>
          <p className='pb-1'>Najlepszy licytant: {bestAuctioner}</p>
          <p className='pb-1'>Zajmujesz #{auctionRanking} miejsce w licytacjach</p>
          <p className='pb-1'>Wygrane licytacje: {auctionsWon} / {auctionsResolvedCount}</p>
        </Col>
      </Row>
  )
}


export function AchieverAuctionsContent(props) {
  const {
    auctionsWon = 0,
    auctionsPoints = 0,
    auctionsParticipations = 0,
    auctionsResolvedCount = 0,
    auctionsCount = 0
  } = props.stats

  return (
      <Row
          className={`h-100 d-flex justify-content-center align-items-center ${
              isMobileView() ? 'flex-column' : 'flex-row'
          }`}
      >
        <Col md={4} className='h-100'>
          <img style={{ maxWidth: '100%' }} height='90%' src={BidImg} alt='Bid image' />
        </Col>
        <Col md={7}>
          <p className='pb-1'>Zlicytowane punkty: {auctionsPoints}</p>
          <p className='pb-1'>Wygrane licytacje: {auctionsWon} / {auctionsResolvedCount}</p>
          <p className='pb-1'>Udziały w licytacjach: {auctionsParticipations} / {auctionsCount}</p>
        </Col>
      </Row>
  )
}

export function CollectiblesInfoContent(props){
  console.log("W contents")
  console.log(props.currentRankNr)
    return (
      <Row
          className={`h-100 d-flex justify-content-center align-items-center ${
              isMobileView() ? 'flex-column' : 'flex-row'
          }`}
      >
        <Col md={4} className='h-100'>
          <img style={{ maxWidth: '100%' }} height='90%' src={CoinImg} alt='Collectible image' />
        </Col>
        <Col md={7}>
          {/* [FK] Stworzylem prototyp kafelka na szybko bo nie mamy funkcji wszystkich do tego jeszcze */}
          <p className='pb-2'>Zdobyte glejty: {props.unlockedBadgesNr}/{props.allBadgesNr}</p>
          <p className='pb-2'>Osiągnięte rangi: {props.currentRankNr}/{props.allRanksNr} </p>
          <p className='pb-2'>Wykonane aktywności: {props.completedActivitiesNr}/{props.allActivitiesNr}</p>
          <p className='pb-2'>Przyjęte propozycje: 0/0</p>
        </Col>
      </Row>

    )
}

export function PersonalRankingInfoContent(props) {
  const userPointsGroup = Math.ceil((props.stats.rankPosition / props.stats.rankLength) * 100)
  const playerType = convertHeroTypeToPlayerType(props.stats.heroType)
  const chartType = playerType === PlayerType.CHALLENGING ? 'BAR' : 'PIE'

  const rankComment = getGameCardInfo(playerType, {
    rankPosition: props.stats.rankPosition,
    rankLength: props.stats.rankLength,
    userPoints: userPointsGroup
  })

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

  const getChartInfo = () => {
    if (chartType === 'BAR') {
      const barLabels = [
        props.stats.betterPlayerPoints != null ? 'Punkty gracza przed Tobą' : '',
        'Twój wynik',
        props.stats.worsePlayerPoints != null ? 'Punkty gracza za Tobą' : ''
      ].filter((label) => !!label)

      const barPoints = [props.stats.betterPlayerPoints, props.stats.userPoints, props.stats.worsePlayerPoints].filter(
        (points) => points != null
      )
      return barConfig(barLabels, barPoints, colorPalette(barLabels.length))
    }

    return pieConfig(
      ['Grupa graczy, w której jesteś', 'Pozostali gracze'],
      [props.stats.rankPosition, props.stats.rankLength],
      colorPalette(2)
    )
  }

  const { data, options } = getChartInfo()

  return (
    <Row className='h-100 d-flex justify-content-center align-items-center'>
      <ChartCol md={12}>
        {chartType === 'BAR' ? <Bar data={data} options={options} /> : <Pie data={data} options={options} />}
      </ChartCol>
      <Col md={12}>
        <p className='text-center w-100'>{rankComment}</p>
      </Col>
    </Row>
  )
}

export function PersonalOverallRankingInfoContent(props) {
  const userPointsGroup = Math.ceil((props.stats.rankPosition / props.stats.rankLength) * 100)
  const playerType = convertHeroTypeToPlayerType(props.stats.heroType)
  const chartType = playerType === PlayerType.CHALLENGING ? 'BAR' : 'PIE'

  const rankComment = getGameCardInfo(playerType, {
    rankPosition: props.stats.overallRankPosition,
    rankLength: props.stats.overallRankLength,
    userPoints: userPointsGroup
  })

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

  const getChartInfo = () => {
    if (chartType === 'BAR') {
      const barLabels = [
        props.stats.betterPlayerPointsOverall != null ? 'Punkty gracza przed Tobą' : '',
        'Twój wynik',
        props.stats.worsePlayerPointsOverall != null ? 'Punkty gracza za Tobą' : ''
      ].filter((label) => !!label)

      const barPoints = [props.stats.betterPlayerPoints, props.stats.userPoints, props.stats.worsePlayerPoints].filter(
        (points) => points != null
      )
      return barConfig(barLabels, barPoints, colorPalette(barLabels.length))
    }

    return pieConfig(
      ['Grupa graczy, w której jesteś', 'Pozostali gracze'],
      [props.stats.rankPosition, props.stats.rankLength],
      colorPalette(2)
    )
  }

  const { data, options } = getChartInfo()

  return (
    <Row className='h-100 d-flex justify-content-center align-items-center'>
      <ChartCol md={12}>
        {chartType === 'BAR' ? <Bar data={data} options={options} /> : <Pie data={data} options={options} />}
      </ChartCol>
      <Col md={12}>
        <p className='text-center w-100'>{rankComment}</p>
      </Col>
    </Row>
  )
}