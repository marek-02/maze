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
      ["Liczba udziałów w licytacjach",dashboardStats?.auctionStats.auctionsParticipations],
      ["Wygrane punkty", dashboardStats?.auctionStats.auctionsPoints.toFixed(2)],
      ["Rozwiązane zadania z licytacji", dashboardStats?.auctionStats.auctionsResolvedCount],
      ["Wygrane",dashboardStats?.auctionStats.auctionsWon],
      ["Najlepszy licytator",dashboardStats?.auctionStats.bestAuctioner]
    ]

    const rows_activityStats = [
      ["Całkowite punkty (Niespodzianki online)", dashboardStats?.generalStats.totalGraphTaskPoints.toFixed(2)],
      ["Całkowite punkty (Niespodzianki stacjo)", dashboardStats?.generalStats.totalFileTaskPoints.toFixed(2)],
      ["Rzeczywiste punkty z niespodzianek", dashboardStats?.generalStats.trueSurprisesPoints.toFixed(2) ],
      ["Średnia (Niespodzianki online)", dashboardStats?.generalStats.avgGraphTask!=undefined ?  dashboardStats?.generalStats.avgGraphTask + '%' : '0%'],
      ["Średnia (Niespodzianki stacjo)", dashboardStats?.generalStats.avgFileTask !=undefined ? dashboardStats?.generalStats.avgFileTask + '%' : '0%'],
      ["Wykonane aktywności",dashboardStats?.generalStats.completedActivities],
      ["Ilość wykonanych sondaży",dashboardStats?.generalStats.surveysNumber]
      // ["Całkowite Punkty (Niespodzianki)", dashboardStats?.generalStats.graphTaskPoints.toFixed(2)],
      // ["Punkty (Zadania bojowe)", dashboardStats?.generalStats.fileTaskPoints.toFixed(2)],
      // ["Punkty bonusowe",dashboardStats?.generalStats.bonusPoints.toFixed(2)]
    ]

    const rows_heroStats = [
      ["Wszystkie punkty",dashboardStats?.generalStats.totalPoints.toFixed(2)],
      ["Ranga",dashboardStats?.generalStats.rankName],
      ["Następna ranga od",dashboardStats?.generalStats.nextLvlPoints != null ? dashboardStats?.generalStats.nextLvlPoints : "MAX"],
      ["Nadmiar oleju", dashboardStats?.generalStats.excessPoints.toFixed(2)],
      ["Punkty do oceny",dashboardStats?.generalStats.truePoints.toFixed(2)],
      ["Punkty (Antał 1)", dashboardStats?.generalStats.firstCaskPoints.toFixed(2)],
      ["Punkty (Antały 2+3+4)", dashboardStats?.generalStats.otherCaskPoints.toFixed(2)], 
      ["Zdobyte glejty",dashboardStats?.generalStats.badgesNumber],     
      ["Wilcze doły",dashboardStats?.generalStats.foundWolfHoles],
      ["Nominacje za pomoc",dashboardStats?.generalStats.receivedNominations],
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