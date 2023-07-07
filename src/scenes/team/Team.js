import { Box, Typography, useTheme } from "@mui/material";
import React,{useState,useEffect} from "react"
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { Personnel } from "../../data/Personnel";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import {actionType} from "../context/Reducer"
import { getAllItems } from "../../utils/firebaseFunctions";
import {useStateValue} from "../context/StateProvider"
import {ref, deleteObject } from "firebase/storage"
import {doc,getDocs,orderBy,setDoc,collection,query,where,deleteDoc, updateDoc,} from "firebase/firestore"
import { storage,firestore } from "../../firebase.config";
import { useNavigate } from "react-router-dom";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [T,setT] = useState([])
  const [{team},dispatch] = useStateValue()
  const history = useNavigate()
  const routeToUpdate = (id,n) =>{
    localStorage.setItem("ASYNC_ID",JSON.stringify(id))
    history(`/updateteam/${id}/${n}`)  
}
  const deleteById = async (id,url) =>{
    const q = query(collection(firestore, "community"), where("id", "==", id));
    const table = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      table.push(doc.id)
    });
    var answer = window.confirm("Voulez vous vraiment supprimer?");
    if (answer) {
        await deleteDoc(doc(firestore,"community",table[0]))
        alert("suppression terminée")
        window.location.reload()
    }
    else {
    //some code
    }
  }
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Nom",
      cellClassName: "name-column--cell",
      width:100
    },
    {
      field: "poste",
      headerName: "Poste",
      headerAlign: "left",
      align: "left",
      width:100

    },
    {
      field: "phone",
      headerName: "Contact",
      width:100,
      textAlign:"left",
      headerAlign:"left"
    },
    {
      field: "ct",
      headerName: "Courriers traités",
      type:"number",
      align: "left",
      headerAlign:"left",
      width:150
    },
    {
        field:"email",
        headerName:"Email",
        width:150
    },
    

    {
      field: "action",
      headerName: "Action",
      flex:1,
      renderCell: ({ row: { privilege,avatar,id,name } }) => {
        return (
         <div style = {{display:"flex",cursor:"pointer"}}> 
           <Box
            width="auto"
            m="2px"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
                "#4c30d2 "
            }
            borderRadius="4px"
          >
            <VisibilityIcon />
            {/* {privilege === "manager" && <SecurityOutlinedIcon />}
            {privilege === "user" && <LockOpenOutlinedIcon />} */}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              Inspecter
            </Typography>
          </Box>
          <Box
            width="auto"
            m="2px"
            p="5px"
            display="flex"
            onClick = {()=>routeToUpdate(id,name)}
            justifyContent="center"
            backgroundColor={
                privilege === "admin"
                ? colors.greenAccent[600]
                : privilege === "manager"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            <SystemUpdateAltIcon/>
            {/* {privilege === "manager" && <SecurityOutlinedIcon />}
            {privilege === "user" && <LockOpenOutlinedIcon />} */}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              Modifier
            </Typography>
          </Box>
          <Box
            onClick = {()=>deleteById(id,avatar)}
            width="auto"
            m="2px"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
               "#880808"
            }
            borderRadius="4px"
          >
            <DeleteForeverIcon/>
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
    await  getAllItems("community","name","asc").then(
         (data) =>{
                let items = [...data]
                items = items.filter(item=>item.status !== "Utilisateur")
                setT(items)
                dispatch(
                    {
                        type:actionType.SET_TEAM_ITEMS,
                        team:items
                    }
                )
         }
      
     )

 }
  useEffect(
    ()=>{
        fetchData()
    },[]
  )
  return (
    <Box m="20px">
      <Header title="Equipe" subtitle="Personnel du bureau" />
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
        <DataGrid checkboxSelection rows={T} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;