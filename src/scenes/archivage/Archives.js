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
import { getDownloadURL, uploadBytesResumable,ref, deleteObject } from 'firebase/storage'
import {storage} from "../../firebase.config"
import {FcFolder} from "react-icons/fc"

const Archives = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [executed,setExecuted] = useState(false)
  const [T,setT] = useState([])
  const [{team},dispatch] = useStateValue()
  const history = useNavigate()
 
  const goToDetails = (name) => {
      history(`/folderdetails/${name}`)  
  }
  const fetchData = async () =>{
    await  getAllItems("folders","name","asc").then(
         (data) =>{

                setT(data)
         }
      
     )
     if(JSON.parse(localStorage.getItem("NewAssetImage"))){
         await deleteObject(ref(storage,JSON.parse(localStorage.getItem("NewAssetImage")))) 
         localStorage.removeItem("NewAssetImage")
     }
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
      <Header button = {"Ajouter"} buttonLink = "/createarchive" title="Archives" subtitle="Ajouter une archive dans la base de données" />
      <div style = {{display:"flex",gap:"55px",flexWrap:"wrap"}}>
          {
            T.map(
              (t)=>{
                return(
                  <div onClick = {()=>goToDetails(t.name)} style = {{display:"column",cursor:"pointer"}}>
                      <FcFolder style = {{fontSize:"100px"}}/>
                      <h2 style = {{color:"white"}}>{t.name}</h2>
                  </div>
                )
              }
            )
          }
      </div>
     
    </Box>
  );
};

export default Archives;