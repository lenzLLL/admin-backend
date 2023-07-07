import React,{useEffect,useState} from "react"
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { Personnel } from "../../data/Personnel";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { OFFICES } from "../../data/offices";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import {RxUpdate} from "react-icons/ri"
import {useStateValue} from "../context/StateProvider"
import Mail from "../../data/Mails"
import {doc,getDocs,orderBy,setDoc,collection,query,where,deleteDoc, updateDoc,} from "firebase/firestore"
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { getAllItems } from "../../utils/firebaseFunctions";
import {actionType} from "../context/Reducer"
import { firestore } from "../../firebase.config";
import { TextField} from "@mui/material";
import { MenuItem } from "@mui/material";
import {useNavigate} from "react-router-dom"

export const getDateTime = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(date);  
}
const MailComponent = ({onSet}) => {
  const theme = useTheme();
  const history = useNavigate()
  const colors = tokens(theme.palette.mode);
  const [M,setM] = useState([])
  const [key,setKey] = useState()
  const [indexB,setIndexB] = useState("Tous les bureaux")
  const [offices,setOffices] = useState([])
  const [saveData,setSaveData] = useState([])
  const [indexS,setIndexS] = useState("Indéfini")
  const [{mails},dispatch] = useStateValue()
  const [executed,setExecuted] = useState(false)
  const deleteById = async (id) =>{
    const q = query(collection(firestore, "courriers"), where("id", "==", id));
    const table = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      table.push(doc.id)
    });
    var answer = window.confirm("Voulez vous vraiment supprimer?");
    if (answer) {
        await deleteDoc(doc(firestore,"courriers",table[0]))   
        alert("suppression terminée")
        window.location.reload()
    }
    else {
    //some code
    }
  }
  const navigateTo = (id) =>{
    localStorage.setItem("ASYNC_ID_OPERATING_MAIL",JSON.stringify(id))
    history("/operating-mail") 
    window.location.reload()
  }
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "title",
      headerName: "Titre",
      cellClassName: "name-column--cell",
      width:150,
      headerAlign:"left",
      textAlign:"left"
    },
    {
      field: "user",
      headerName: "Utilisateur",
      headerAlign: "left",
      align: "left",
      width:100

    },
    {
      field: "dateReception",
      field:"Date",
      headerName: "Date de reception",
      width:200,
      align:"left",
      headerAlign:"left",
      renderCell:({row:{dateReception}})=>{
        
        return (
          <h3 sytle = {{fontWeight:500}}>{getDateTime(dateReception)}</h3>
        )
      }
    },
    {
        field:"status",
        headerName:"Statut",
        width:150
    },
    {
      field: "action",
      headerName: "Action",
      flex:1,
      renderCell: ({ row: { privilege,id } }) => {
        return (
         <div style = {{display:"flex",cursor:"pointer"}}> 
          <Box
            width="auto"
            m="2px"
            pr="17px"
            pt ="5px"
            pb ="5px"
            pl = "10px"
            display="flex"
            justifyContent="center"
            onClick = {()=>navigateTo(id)}
            backgroundColor={
                privilege === "admin"
                ? colors.greenAccent[600]
                : privilege === "manager"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
            sx = {{
              cursor:"pointer"
            }}
          >
      
            {/* {privilege === "manager" && <SecurityOutlinedIcon />}
            {privilege === "user" && <LockOpenOutlinedIcon />} */}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                Traiter
            </Typography>
          </Box>
          <Box
            
            width="auto"
            m="2px"
            pr="17px"
            pt ="5px"
            pb ="5px"
            pl = "10px"
            display="flex"
            justifyContent="center"
            backgroundColor={
               
                 colors.blueAccent[500]
     
            }
            borderRadius="4px"
            sx = {{
              cursor:"pointer"
            }}
          >
      
            {/* {privilege === "manager" && <SecurityOutlinedIcon />}
            {privilege === "user" && <LockOpenOutlinedIcon />} */}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                Modifier
            </Typography>
          </Box>
          <Box
            onClick = {()=>deleteById(id)}
            width="auto"
            m="2px"
            pr="17px"
            pt ="5px"
            pb ="5px"
            pl = "10px"
            display="flex"
            justifyContent="center"
            backgroundColor={
               
                 colors.redAccent[500]
     
            }
            borderRadius="4px"
            sx = {{
              cursor:"pointer"
            }}
          >
      
            {/* {privilege === "manager" && <SecurityOutlinedIcon />}
            {privilege === "user" && <LockOpenOutlinedIcon />} */}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                Supprimer
            </Typography>
          </Box>
          </div>
        );
      },
    },
  ];
const fetchData = async () =>{
  await  getAllItems("courriers","dateReception","desc").then(
       (data) =>{
        let items = data     
        items = data.filter((item)=>item.bureau === key)
        items = items.filter(item=>item.status !== "Validé")
        setSaveData(data)
              setM(items)

              dispatch(
                  {

                      type:actionType.SET_MAIL_ITEMS,
                      mails:data
                  }
              )
       }
    
   )
}
const fetchOffices = async () =>{
  await  getAllItems("offices","name","asc").then(
       (data) =>{
        let items = data   
        setOffices([])  
        for(let i = 0;i<items.length;i++)
        {
          setOffices(state => [...state,items[i]?.name])
        }
       }  
   )
  setExecuted(true)
}
const handleChange = (name,value) => {
    setM(saveData)
    if(name === "bureau")
    {
         setIndexB(value)
         if(value === "Tous les bureaux")
         {
              if(indexS === "Indéfini")
              {
               
              }
              else{
                  let items = saveData
                  items = items.filter(item=>item.status === indexS)
                  setM(items)
              }
         } 
         else{
             if(indexS === "Indéfini")
              {
                let items = saveData
                items = items.filter(item=>item.bureau === value)
                setM(items)
              }
              else{
                let items = saveData
                items = items.filter(item=>item.bureau === value)
                items = items.filter(item=>item.status === indexS)
                setM(items)
              }
         }
    } 
    else{
         setIndexS(value)
         if(value === "Indéfini")
         {
              if(indexB === "Tous les bureaux")
              {
               
              }
              else{
                  let items = saveData
                  items = items.filter(item=>item.bureau === indexB)
                  setM(items)
              }
         } 
         else{
             if(indexB === "Tous les bureaux")
              {
                let items = saveData
                items = items.filter(item=>item.status === value)
                setM(items)
              }
              else{
                let items = saveData
                items = items.filter(item=>item.bureau === indexB)
                items = items.filter(item=>item.status === value)
                setM(items)
              }
         }  
    }   
}
useEffect(
    ()=>{
        if(executed)
        {
          return
        }
        if(localStorage.getItem("USER_COMMUNE"))
        {
            if(JSON.parse(localStorage.getItem("USER_COMMUNE"))["status"] === "Administrateur")
            {
              setKey(JSON.parse(localStorage.getItem("USER_COMMUNE"))["bureau"])
            }
        }
        fetchData()
        fetchOffices()
    },[key]
  )

  return (
    <Box m="20px">
      <Header title="Bureaux" subtitle="Bureaux de la communauté" />
      <div style = {{display:"flex",margin:0,justifyContent:"space-between",alignItems:"center"}}>
          <h2>Filtre</h2>
          <div style = {{display:"flex",width:"70%",margin:0,justifyContent:"center",gap:"10px",alignItems:"center"}}>
                    <TextField
                       id="standard-select-currency"
                       select
                       variant ="filled"
                       label="Bureaux"
                       name ="bureau"
                       fullWidth
                       onChange = {(e)=>handleChange("bureau",e.target.value)}
                       sx={{ gridColumn: "span 2" }}
                    >
                        {["Tous les bureaux",...offices]?.map((option) => (

                        <MenuItem key={option} value={option}>
                           {option}
                        </MenuItem>

                        ))}

                    </TextField>
                    <TextField
                       fullWidth
                       id="standard-select-currency"
                       select
                       variant ="filled"
                       label="Statut"
                       name ="Statut"
                       onChange={(e)=>handleChange("status",e.target.value)}
                       sx={{ gridColumn: "span 2" }}
                    >
                        {["Indéfini","En cours","Délais dépassé","Validé","Rejeté","Renvoyé","Suspendu"]?.map((option) => (

                        <MenuItem key={option} value={option}>
                           {option}
                        </MenuItem>

                        ))}

                    </TextField>   
          </div>
      </div>
      <Box
        m="40px 0 0 0"
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={M} columns={columns} />
      </Box>
    </Box>
  );
};

export default MailComponent;