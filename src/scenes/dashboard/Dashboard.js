import React,{useState,useEffect} from 'react'
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from '../../components/Header'
import BarChart from '../../components/BarChart'
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { useNavigate } from 'react-router-dom';
import {getAllItems, getItem} from "../../utils/firebaseFunctions"
import { validate } from 'uuid';
import { getDateTime } from '../Mail/Mail';
export default function Dashboard() {
  const theme = useTheme();
  const history = useNavigate()
  const colors = tokens(theme.palette.mode);
  const [courriers,setCourriers] = useState({courriers:0,validated:0})
  const [community,setCommunity] = useState({personnel:0,commune:0})
  const [executed,setExecuted] = useState(false)
  const [allOffices,setAllOffices] = useState([])
  const [offices,setOffices] = useState(0)
  const [validatedCourriers,setValidatedCourriers] = useState([])
  const [statsBar,setStatsBar] = useState([])
  const getAllStats = async () =>{
      let items = await getAllItems("courriers","description","asc")
      setExecuted(true)
      let valide = items.filter(item => item.status == "Validé")
      setCourriers({courriers:items.length,validated:valide.length})
      setValidatedCourriers(valide)
      items = await getAllItems("community","name","asc")
      let tampon1 = items.filter(item=>item.status === "Utilisateur")
      let tampon2 = items.filter(item=>item.status !== "Utilisateur")
      setCommunity(state=>({commune:tampon1.length,personnel:tampon2.length}))
      items = await getAllItems("offices","name","asc")
      setOffices(items.length)
     
  }
  const getStatsBar = async () => {

    let items = await getAllItems("offices","name","asc")
    let table = []
    for(let i = 0;i<items.length;i++)
    {
         table.push({
             bureau:items[i].name,
             "Courriers en cours":items[i].cec,
             "Courriers délai dépassé":items[i].cdd,
             "Courriers traités":items[i].cv,
             "Courriers en attente":items[i].cea,
             "Courriers rejetés":items[i].crjt,
             "Courriers renvoyés":items[i].crvy,
             "Courriers suspendus":items[i].cs,
             "Courriers validés":items[i].cv
         })
    }
    setStatsBar(table)

    
  }
  const goToMail = () => {
    history("/courrier")
    window.location.reload()  
  }
  useEffect(
    () =>{
        if(executed)
        {
          return
        }
        getStatsBar()
        getAllStats() 
        
    },[]
  )
  return (
    <Box m="20px" sx = {{
      
    }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header title="DASHBOARD" subtitle="Bienvenue dans votre zone de travail" />
            <Box>
                <Button 
                    onClick = {()=>goToMail()}
                    sx={{
                    backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                   }}
            >
            <EmailIcon sx={{ mr: "10px" }} />
            Ajouter un courrier
           </Button>
           </Box> 
           
        </Box>
        <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${courriers.courriers}`}
            subtitle="Courriers"
            progress={`${courriers.courriers === 0?  0:(courriers.validated/courriers.courriers)}`}
            increase= {`${courriers.courriers === 0?  0:(courriers.validated/courriers.courriers)*100}% validés`}
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${community.commune}`}
            subtitle="Communauté"
            progress={`${community.commune === 0?0:(community.commune/(community.commune+community.personnel))}`}
            increase={`${community.commune === 0?0:((community.commune/(community.commune+community.personnel))*100)}%`}
            icon={
              <PeopleAltIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${offices}`}
            subtitle="Bureaux"
            progress="1"
            increase=""
            icon={
              <MeetingRoomIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${community.personnel}`}
            subtitle="Fonctionnaires"
            progress={`${community.personnel === 0?0:(community.personnel/(community.commune+community.personnel))}`}
            increase={`${community.personnel === 0?0:((community.personnel/(community.commune+community.personnel))*100)}%`}
            icon={
              <EngineeringIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Activités des bureaux
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                {`${courriers.courriers} Courriers`}
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart stats = {allOffices} isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Historique des courriers validés
            </Typography>
          </Box>
          {validatedCourriers?.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.title}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{getDateTime(transaction.dateValidation)}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                infos
              </Box>
            </Box>
          ))}
        </Box>
        {/* LAST COMPONENT  */}      
              <Box
          gridColumn="span 8"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Statistiques
          </Typography>
          <Box height="400px">
            <BarChart data = {statsBar} isDashboard={true} />
          </Box>
        </Box>
        <Box
                  gridColumn="span 4"
                  gridRow="span 2"
                  backgroundColor={colors.primary[400]}
                  p="30px"
              >
                  <Typography variant="h5" fontWeight="600">
                      Efficacité
                  </Typography>
              <Box
                display="flex"
                  flexDirection="column"
                 alignItems="center"
                  mt="25px"
              >
                  <ProgressCircle progress = {`${courriers.validated === 0 ? 0:(courriers.validated/(courriers.courriers))}`} size="125" />
                  <Typography
                      variant="h5"
                      color={colors.greenAccent[500]}
                      sx={{ mt: "15px" }}
                  >
                    {`${courriers.validated === 0 ? 0:((courriers.validated/(courriers.courriers))*100)}% des courriers traités`}
                  </Typography>
                  <Typography align='left' sr = {{textAlign:"center"}}>données permettant de jauger l'éfficacité<br/>de travail</Typography>
              </Box>
        
              </Box>
        {/* LAST COMPONENT  */}

        </Box>
        
    </Box>
  )
}
