import { useAppSelector } from '../../../hooks/hooks'
import StudentService from '../../../services/student.service'
import { useEffect, useState } from 'react'
import {TableContainer} from './AllStatsPageStyles'
import {connect} from 'react-redux'


function AllStatsPage(props){
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

    useEffect(() => {
        console.log("DashBoardStats")
        console.log(dashboardStats)
        console.log("HeroStatsDTO")
        console.log(dashboardStats?.heroTypeStatsDTO)
        console.log("General stats")
        console.log(dashboardStats?.generalStats)
    },[dashboardStats])

    {/* <p className='pb-1'>Punkty doświadczenia: {props.stats.experiencePoints}</p>
        <p className='pb-1'>Punkty do kolejnej rangi: {props.stats.nextLvlPoints}</p>
        <p className='pb-1'>Ranga: {props.stats.rankName}</p>
        <p className='pb-1'>Zdobytych medali: {props.stats.badgesNumber}</p>
        <p>Wykonanych aktywności: {props.stats.completedActivities}</p> */}

    const row_titles_heroTypeStatsDTO = ["Miejsce w rankingu","Liczba osób w rankingu","", "Punkty doświadczenia", "Punkty do kolejnej rangi", "Ranga", "Zdobytych medali", "Wykonanych aktywnosci"]
    
    const row_titles_heroStatsDTO = ["Liczba odznak","Ukończone aktywności","Punkty doświadczenia","Punkty do następnej rangi","Aktualna ranga"]

    //GeneralStats
    //const row_titles_generalStats = ["Punkty",""] Tu sie zdaja byc dosyc nieaktualne statystyki
    
    const row_titles_auctionStats = ["Miejsce w rankingu licytacji?","Liczba wszystkich licytacji", "Liczba udziałów w licytacjach","Wygrane punkty","Rozwiązane zadania z licytacji", "Wygrane","Najlepszy licytator"]

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