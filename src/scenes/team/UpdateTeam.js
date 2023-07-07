import React,{ useEffect,useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { MenuItem } from "@mui/material";
import {firestore} from "../../firebase.config"
import {doc,getDocs,orderBy,setDoc,collection,query,where,deleteDoc, updateDoc,} from "firebase/firestore"
import { useNavigate,useParams } from "react-router-dom";

const UpdateCommunity = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [poste,setPoste] = useState("")
  const [bureau,setBureau] = useState("")
  const [status,setStatus] = useState("")
  const history = useNavigate()
  const {id} = useParams()
  const {n} = useParams()
  const [postes,setPostes] = useState([])
  const [offices,setOffices] = useState([])
  const getUser = async () =>{
    const q = query(collection(firestore, "community"), where("id", "==", JSON.parse(localStorage.getItem("ASYNC_ID"))));
    const table = []
    const data = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      data.push(doc.data())
      table.push(doc.id)
    });
    setBureau(data[0].bureau)
    setStatus(data[0].status)
    setPoste(data[0].poste)
    return table[0]
  }
  const getAllItems = async (table,field,order ="desc") =>{
    const items = await getDocs(
        query(collection(firestore,table),orderBy(field,order))
    )
 
  
    return items.docs.map((doc)=>doc.data()?.name)
  }
  const fetchAllDatas = async () =>{
      await getAllItems("postes","name","asc").then(
        (data)=>{
            let items = [...data]
            setPostes(items)           
        }
      )
      await getAllItems("offices","name","asc").then(
        (data)=>{
            let items = [...data]
            setOffices(items)           
        }
      )
  }
  const handleSubmit =  async (e) => {
    e.preventDefault()
    if(!poste || !bureau || !status)
    {
      alert("Veillez remplir tous les champs avant d'enregistrer")
    }
    else{
      let u = await getUser()
      const ref = doc(firestore,"community",u)
      await updateDoc(ref,{poste,bureau,status}).then(()=>{
         alert("Modification terminé")
         localStorage.removeItem("ASYNC_ID")
         history("/team")
      }).catch(
        (err)=>{
          console.log(err)
          alert(err)
        }
      )
   
    
    }
  };
  const Privilèges = [
    "Utilisateur",
    "Fonctionnaire",
    "Chef de service",
    "Administrateur",
  ]
  useEffect(
    ()=>{
        getUser()
        fetchAllDatas()
    },[]
  )
  return (
    <Box m="20px">
      <Header title="Personnel" subtitle="Modifier les informations du personnel" />
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                disabled = {true}
                label="Nom complet"
                value={n}
                name="name"
                sx={{ gridColumn: "span 2" }}
              />

                  <TextField
          id="standard-select-currency"
          select
          variant ="filled"
          label="Poste"
          name = "poste"
          value = {poste}
          onChange={(e)=>setPoste(e.target.value)}
          sx={{ gridColumn: "span 2" }}
        >
          {postes.map((option) => (

               <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>

          ))}
        </TextField>
        <TextField
          id="bureau"
          select
          variant ="filled"
          label="Bureau"
          name = "bureau"
          value = {bureau}
          onChange={(e)=>setBureau(e.target.value)}
          sx={{ gridColumn: "span 2" }}
        >
          {offices.map((option) => (

               <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>

          ))}
        </TextField>
        <TextField
          id="privilege"
          select
          variant ="filled"
          label="Privilège"
          name = "privilege"
          value = {status}
          onChange={(e)=>setStatus(e.target.value)}
          sx={{ gridColumn: "span 2" }}
        >
          {Privilèges.map((option) => (

               <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>

          ))}
          </TextField>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Enregistrer
              </Button>
            </Box>
          </form>
    </Box>
  );
};





export default UpdateCommunity;