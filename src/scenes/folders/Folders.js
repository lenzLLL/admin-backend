import { Box, Typography, useTheme } from "@mui/material";
import React,{useState,useEffect} from "react"
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { getAllItems } from "../../utils/firebaseFunctions";
import {useStateValue} from "../context/StateProvider"
import {doc,getDocs,orderBy,setDoc,collection,query,where,deleteDoc, updateDoc,} from "firebase/firestore"
import {firestore } from "../../firebase.config";
import { useNavigate } from "react-router-dom";

const Folders = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [executed,setExecuted] = useState(false)
  const [T,setT] = useState([])
  const [{team},dispatch] = useStateValue()
  const history = useNavigate()
  const routeToUpdate = (id,n) =>{
    localStorage.setItem("ASYNC_ID",JSON.stringify(id))
    history(`/updatefolder/${id}/${n}`)  
  }
  const deleteById = async (id) =>{
    const q = query(collection(firestore, "folders"), where("id", "==", id));
    const table = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      table.push(doc.id)
    });
    var answer = window.confirm("Voulez vous vraiment supprimer?");
    if (answer) {
        await deleteDoc(doc(firestore,"folders",table[0]))
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
      flex:1
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
    await  getAllItems("folders","name","asc").then(
         (data) =>{

                setT(data)
         }
      
     )
     setExecuted(true)

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
      <Header button = {"Ajouter"} buttonLink = "/createfolder" title="Dossiers" subtitle="chaque archive doit corresponde à un type dossier" />
      <Box
        m="40px auto"
        height="70vh"
        width ="75vw"
        display={"flex"}
        justifyContent ="center"
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

export default Folders;