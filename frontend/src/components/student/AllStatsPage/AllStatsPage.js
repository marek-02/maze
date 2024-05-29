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
          localStorage.setItem('heroType', response.heroTypeStatsDTO.heroType)
          setHeroType(response.heroTypeStatsDTO.heroType)
        })
        .catch(() => setDashboardStats(null))
      
    }, [])

    //Ten efekt jest do wyjazdu po testach
    useEffect(() => {
        console.log("DashBoardStats")
        console.log(dashboardStats)
        
    },[dashboardStats])

    const rows_auctionStats = [
      ["Miejsce w rankingu licytacji",dashboardStats?.auctionStats.auctionRanking],
      ["Liczba wszystkich licytacji",dashboardStats?.auctionStats.auctionsCount],
      ["Liczba udziałów w licytacjach",dashboardStats?.auctionsParticipations],
      ["Wygrane punkty", dashboardStats?.auctionStats.auctionsPoints],
      ["Rozwiązane zadania z licytacji", dashboardStats?.auctionStats.auctionsResolvedCount],
      ["Wygrane",dashboardStats?.auctionStats.auctionsWon],
      ["Najlepszy licytator",dashboardStats?.auctionStats.bestAuctioner]
    ]

    const rows_activityStats = [
      ["Punkty z aktywności:",dashboardStats?.generalStats.allPoints],
      ["Wykonane aktywności",dashboardStats?.heroStatsDTO.completedActivities]
      ["Średnia (Ekspedycje)", dashboardStats?.generalStats.avgGraphTask!=0 ? dashboardStats?.generalStats.avgGraphTask : 0],
      ["Średnia (Zadania bojowe)", dashboardStats?.generalStats.avgFileTask !=0 ? dashboardStats?.generalStats.avgFileTask  : 0],
      ["Ilość wykonanych sondaży",dashboardStats?.generalStats.surveysNumber],
      ["Punkty (Ekspedycje)",dashboardStats?.generalStats.graphTaskPoints],
      ["Punkty (Zadania bojowe)",dashboardStats?.generalStats.fileTaskPoints]
    ]

    const rows_heroStats = [
      ["Punkty",dashboardStats?.heroStatsDTO.experiencePoints],
      ["Następny poziom za:",dashboardStats?.heroStatsDTO.nextLvlPoints != null ? dashboardStats?.heroStatsDTO.nextLvlPoints : "MAX"],
      ["Ranga",dashboardStats?.heroStatsDTO.rankName],
      ["Typ postaci", dashboardStats?.heroTypeStatsDTO.heroType == "UNFORTUNATE" ? "Nieszczęśnik" : "Nieszczęśnica"],
      ["Zdobyte glejty",dashboardStats?.heroStats.badgesNumber]
    ]

    const rows_ranking = [
      ["Punkty najbliższego rywala",dashboardStats?.heroTypeStatsDTO.betterPlayerPointsOverall != null
         ? dashboardStats?.heroTypeStatsDTO.betterPlayerPointsOverall : "PROWADZISZ"],
      ["Liczba osób w rankingu", dashboardStats?.heroTypeStatsDTO.rankLength],
      ["Miejsce w rankingu", dashboardStats?.heroTypeStatsDTO.rankPosition],
      ["Miejsce w rankingu", dashboardStats?.heroTypeStatsDTO.rankPosition]
    ]

    const rows_confidant = [
      ["Punkty zausznika",dashboardStats?.submitStats.submitPoints],
      ["Złożone propozycje", dashboardStats?.submitTaskResultCount],
      ["Przyjęte propozycje", dashboardStats?.fileTaskResultCount]
    ]
    
    
    return(
    <>
      <TableContainer
        style={{ width: '25%' }}
        $fontColor={props.theme.font}
        $background={props.theme.primary}
        $tdColor={props.theme.secondary}
      >
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Wartość</th>
          </tr>
        </thead>
        <tbody className="mh-100">
        
          {/* {dashboardStats.heroTypeStatsDTO.map()}

          {studentsList?.length > 0 ? (
            studentsList.map((student, index) => (
              <tr key={index + student.groupName}>
                <td className="py-2">{student.groupName}</td>
                <td className="py-2">
                  {student.firstName} {student.lastName}
                </td>
                <td className="py-2 text-center">
                  <Button
                    style={{ backgroundColor: props.theme.success, border: 'none' }}
                    onClick={() => {
                      setChosenStudent(student)
                      setChangeGroupModalOpen(true)
                    }}
                  >
                    Zmień grupę
                  </Button>
                  <Button
                    className="ms-2"
                    style={{ backgroundColor: props.theme.success, border: 'none' }}
                    onClick={() => {
                      setChosenStudent(student)
                      setBonusPointsModalOpen(true)
                    }}
                  >
                    Przyznaj punkty
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='100%' className="text-center">
                <p>{studentsList == null ? ERROR_OCCURRED : 'Brak członków'}</p>
              </td>
            </tr>
          )}*/}
        </tbody> 
      </TableContainer>
    </>
    )
}


function mapStateToProps(state) {
    const {theme} = state

    return {theme}
}
export default connect(mapStateToProps)(AllStatsPage)