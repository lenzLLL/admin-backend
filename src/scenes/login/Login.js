import React,{useState} from 'react'
import { Box, Button, TextField } from "@mui/material";
import { getSectionClassNames } from '@fullcalendar/core/internal';
import {doc,getDocs,orderBy,setDoc,collection,query,where,deleteDoc, updateDoc,} from "firebase/firestore"
import SaveButton from "../button/Button"
import {v4 as uuidv4} from "uuid"
import {firestore} from "../../firebase.config"


export default function Login() {
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const getUser = async () =>{
      const q = query(collection(firestore, "community"), where("name", "==", name.toString()),where("email", "==", email.toString()));
      const table = []
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        table.push(doc.data())
      });
      return table[0]
  }
    const handleSubmit = async (e) =>{
      e.preventDefault()  
      const user = await getUser().catch(
        (err)=>{
          alert("error: "+err)
        }
      )
     
        if(user.email && user.name)
        {
             localStorage.setItem("USER_COMMUNE",JSON.stringify(user))
             alert("Connexion réussie") 
             window.location.reload()
        }
        else{
          alert("echec")
        }
    }
    
    return (
    <div style = {{width:"100%",height:"100%",display:'flex',alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
        <form onSubmit={handleSubmit} style = {{padding:"20px",width:"50%",height:"50%",boxShadow:"0 0 4px rgba(0,0,0,0.5)",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
            <h1 style = {{color:"white",marginBottom:"20px"}}>Se Connecter</h1>
            <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nom"
                onChange={(e)=>setName(e.target.value)}
                value={name}
                name="name"
                sx={{ gridColumn: "span 2",marginBottom:"15px" }}
              />
  
                            <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onChange={(e)=>setEmail(e.target.value)}
                value={email}
                name="email"
                sx={{ gridColumn: "span 2" }}
              />
              <div style =  {{alignSelf:"flex-start",marginTop:"25px",width:"100%"}}>  
                  <SaveButton  type = "submit">Connexion</SaveButton>  
              </div>
        </form>
    </div>
  )
}


