import { useAppSelector } from '../../../hooks/hooks'
import StudentService from '../../../services/student.service'
import { useEffect, useState } from 'react'
import {TableContainer} from './AllStatsPageStyles'
import {connect} from 'react-redux'
import UserService from '../../../services/user.service'
import RankService from '../../../services/rank.service'
import ActivityService from '../../../services/activity.service'


function AllStatsPage(props){
    const [dashboardStats, setDashboardStats] = useState(undefined)
    const courseId = useAppSelector((state) => state.user.courseId)

    useEffect(() => {
      StudentService.getDashboardStats(courseId)
      .then((response) => {
        setDashboardStats(response)
      })
      .catch(() => setDashboardStats(null))
      
    }, [])

    const rows_auctionStats = [
      ["Miejsce w rankingu licytacji",dashboardStats?.auctionStats.auctionRanking],
      ["Liczba wszystkich licytacji",dashboardStats?.auctionStats.auctionsCount],
      ["Liczba udziałów w licytacjach",dashboardStats?.auctionsParticipations != undefined ? dashboardStats?.auctionsParticipations : 0],
      ["Wygrane punkty", dashboardStats?.auctionStats.auctionsPoints.toFixed(2)],
      ["Rozwiązane zadania z licytacji", dashboardStats?.auctionStats.auctionsResolvedCount],
      ["Wygrane",dashboardStats?.auctionStats.auctionsWon],
      ["Najlepszy licytator",dashboardStats?.auctionStats.bestAuctioner]
    ]

    const rows_activityStats = [
      ["Punkty z aktywności:", dashboardStats?.generalStats.allPoints.toFixed(2) ],
      ["Wykonane aktywności",dashboardStats?.heroStatsDTO.completedActivities],
      ["Średnia (Niespodzianki)", dashboardStats?.generalStats.avgGraphTask!=undefined ?  dashboardStats?.generalStats.avgGraphTask + '%' : '0%'],
      ["Średnia (Zadania bojowe)", dashboardStats?.generalStats.avgFileTask !=undefined ? dashboardStats?.generalStats.avgFileTask + '%' : '0%'],
      ["Ilość wykonanych sondaży",dashboardStats?.generalStats.surveysNumber],
      ["Punkty (Niespodzianki)", dashboardStats?.generalStats.graphTaskPoints.toFixed(2)],
      ["Punkty (Zadania bojowe)", dashboardStats?.generalStats.fileTaskPoints.toFixed(2)],
      ["Punkty bonusowe",dashboardStats?.generalStats.bonusPoints.toFixed(2)]
    ]

    const rows_heroStats = [
      ["Punkty",dashboardStats?.heroStatsDTO.experiencePoints.toFixed(2)],
      ["Następny poziom od",dashboardStats?.heroStatsDTO.nextLvlPoints != null ? dashboardStats?.heroStatsDTO.nextLvlPoints : "MAX"],
      ["Ranga",dashboardStats?.heroStatsDTO.rankName],
      ["Typ postaci", dashboardStats?.heroTypeStatsDTO.heroType == "UNFORTUNATE" ? "Nieszczęśnik" : "Nieszczęśnica"],
      ["Zdobyte glejty",dashboardStats?.heroStatsDTO.badgesNumber]
    ]

    const rows_ranking = [
      ["Punkty najbliższego rywala",dashboardStats?.heroTypeStatsDTO.betterPlayerPointsOverall != null
         ? dashboardStats?.heroTypeStatsDTO.betterPlayerPointsOverall.toFixed(2) : "PROWADZISZ"],
      ["Liczba osób w rankingu", dashboardStats?.heroTypeStatsDTO.rankLength],
      ["Miejsce w rankingu", dashboardStats?.heroTypeStatsDTO.rankPosition]
    ]

    const rows_confidant = [
      ["Punkty zausznika",dashboardStats?.submitStats.submitPoints.toFixed(2)],
      ["Złożone propozycje", dashboardStats?.submitStats.submitTaskResultCount != undefined ? dashboardStats?.submitStats.submitTaskResultCount : 0],
      ["Przyjęte propozycje", dashboardStats?.submitStats.fileTaskResultCount != undefined ? dashboardStats?.submitStats.fileTaskResultCount : 0]
    ]

    const all_rows = [rows_auctionStats,rows_activityStats, rows_heroStats, rows_ranking, rows_confidant]
    return(
    <div style={{display: "flex", padding: "0px 10% 0px 10%", overflow: "wrap", flexWrap: "wrap", justifyContent: "center"}} >
      {
      all_rows?.map((row,index) => {
        return (
          <TableContainer
          style={{ width: '20%', textAlign: "center", marginRight: "8%", width: "20%", marginBottom: "5%"}}
          $fontColor={props.theme.font}
          $background={props.theme.primary}
          $tdColor={props.theme.secondary}
          >
          <thead style={{height: "50px"}}>
            <tr>
              <th>Nazwa</th>
              <th>Wartość</th>
            </tr>
          </thead>
          <tbody className="mh-100">
            {              
              row?.map((entry,index)=> {
                return(
                <tr key={index}>
                  <td>{entry[0]}</td>
                  <td>{entry[1]}</td>
                </tr>
                )
              })          
            }
          </tbody> 
        </TableContainer>
        )
      })
    }
      
    </div>
    )
}


function mapStateToProps(state) {
    const {theme} = state

    return {theme}
}
export default connect(mapStateToProps)(AllStatsPage)