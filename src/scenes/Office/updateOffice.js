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

const UpdateOffice = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [name,setName] = useState("")
  const [executed,setExecuted] = useState(false)
  const [description,setDescription] = useState("")
  const history = useNavigate()
  const {id} = useParams()
  const getOffice = async () =>{
    setExecuted(true)
    const q = query(collection(firestore, "offices"), where("id", "==",JSON.parse(localStorage.getItem("ASYNC_ID"))));
    const table = []
    const data = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      table.push(doc.id)
      data.push(doc.data())
    });
    setName(data[0]?.name)
    setDescription(data[0]?.description)
    return table[0]
  }
  const handleSubmit =  async (e) => {
    e.preventDefault()
    if(!name || !description )
    {
      alert("Veillez remplir tous les champs avant d'enregistrer")
    }
    else{
       let u = await getOffice()
       const ref = doc(firestore,"offices",u)
       await updateDoc(ref,{description,name}).then(()=>{
          alert("Modification terminé")
          localStorage.removeItem("ASYNC_ID")
          history("/offices")
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
        if(executed)
        {
            return
        }
        getOffice()
    },[]
  )
  return (
    <Box m="20px">
      <Header title="Bureau" subtitle="Modifier un bureau" />
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
                label="Nom complet"
                value={name}
                onChange = {(e)=>setName(e.target.value)}
                name="name"
                sx={{ gridColumn: "span 4" }}
              />


        <TextField
          id="outlined-multiline-flexible"
          label="Description"
          multiline
          variant = "filled"
          minRows={4}
          value={description}
          name ="description"
          onChange={(e)=>setDescription(e.target.value)}
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





export default UpdateOffice;