import React,{useState,useEffect} from "react"
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
import { getAllItems } from "../../utils/firebaseFunctions";
import {doc,getDocs,orderBy,setDoc,collection,query,where,deleteDoc, updateDoc,} from "firebase/firestore"
import {ref, deleteObject } from "firebase/storage"
import { firestore } from "../../firebase.config";
import { useNavigate } from "react-router-dom";

const Offices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [executed,setExecuted] = useState(false)
  const history = useNavigate()
  const [o,setO] = useState([])
  const deleteById = async (id) =>{
    const q = query(collection(firestore, "offices"), where("id", "==", id));
    const table = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      table.push(doc.id)
    });
    var answer = window.confirm("Voulez vous vraiment supprimer?");
    if (answer) {
        await deleteDoc(doc(firestore,"offices",table[0]))  
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
      width:100,
      headerAlign:"left",
      textAlign:"left"
    },
    {
      field: "c",
      headerName: "Courriers",
      width:100,
      type:"number",
      align:"left",
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
        field:"cdd",
        headerName:"Courriers Delai dépassé",
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
            onClick = {()=>goToUpdate(id)}
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
            onClick = {()=>deleteById(id)}
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
  const goToUpdate = (id) => {
      history("/updateoffice/"+id)
      localStorage.setItem("ASYNC_ID",JSON.stringify(id))  
  }

  const fetchData = async () =>{
    setExecuted(true)
    await  getAllItems("offices","name","asc").then(
         (data) =>{
              setO(data)
              console.log("cool")
         }
      
     )

 }

  useEffect(
    ()=>{
     if(executed)
     {
        return
     } 
     fetchData()
    },[]
  )
  return (
    <Box m="20px">
      <Header button = "Ajouter bureau" buttonLink = "/createoffice" title="Bureaux" subtitle="Bureaux de la communauté" />
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
        <DataGrid checkboxSelection rows={o} columns={columns} />
      </Box>
    </Box>
  );
};

export default Offices;