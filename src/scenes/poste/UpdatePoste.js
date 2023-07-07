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

const UpdatePoste = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [name,setName] = useState("")
  const {id} = useParams()
  const history = useNavigate()
  const {n} = useParams()
  const getPoste = async () =>{
    const q = query(collection(firestore, "postes"), where("id", "==", JSON.parse(localStorage.getItem("ASYNC_ID"))));
    const table = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      table.push(doc.id)
    });
    return table[0]
  }

  const handleSubmit =  async (e) => {
    e.preventDefault()
    if(!name)
    {
      alert("Veillez remplir tous les champs avant d'enregistrer")
    }
    else{
      let u = await getPoste()
      const ref = doc(firestore,"postes",u)
      await updateDoc(ref,{name}).then(()=>{
         alert("Modification terminé")
         localStorage.removeItem("ASYNC_ID")
         history("/postes")
      }).catch(
        (err)=>{
          console.log(err)
          alert(err)
        }
      )
   
    
    }
  };
 
  useEffect(
    ()=>{
        setName(n)
    },[]
  )
  return (
    <Box m="20px">
      <Header title="Poste" subtitle="Modifier un poste" />
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
                onChange = {(e)=>setName(e.target.value)}
                label="Nom"
                value={name}
                name="name"
                sx={{ gridColumn: "span 4" }}
              />

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





export default UpdatePoste;