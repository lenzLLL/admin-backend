import React, { useRef,useState,useEffect} from 'react';
import emailjs from '@emailjs/browser';
import {useNavigate} from "react-router-dom"
import Header from "../../components/Header";
import { Box } from '@mui/system';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { secondParameter,fisrtParameter } from '../../data/mail_data';
export const SendMail = (steps) => {
  const form = useRef();
  const [message,setMessage] = useState("")
  const [email,setEmail] = useState("")
  const [type,setType] = useState("")
  const [name,setName] = useState("")
  const history = useNavigate()
  const verifyMail = () =>{
    if(localStorage.getItem("SEND_MAIL_COMMUNE")){
      let infos =  JSON.parse(localStorage.getItem("SEND_MAIL_COMMUNE"))
      setType(infos?.type)
      if(type === "cr")
      {
        if(!localStorage.getItem("ID_COURRIER"))
        {
          history("/courrier")
          return
        }
        else{
            let ID_COURRIER = JSON.parse(localStorage.getItem("ID_COURRIER"))
            if(ID_COURRIER.step !== 4)
            {
              history("/courrier")
              return
            }    
        }

      }
      setEmail(infos?.email)
      setName(infos?.name)
      setMessage(infos?.message)
    }
    else{
      history("/")
    }
  }
  const deleteData = () =>{
    if(type)
    {
      if(type === "cr")
      {

      }
    }
  }
  const sendEmail = async (e) =>{
    e.preventDefault();   
    await emailjs.sendForm(fisrtParameter,secondParameter,form.current, 't2jyWL1E2-LLpGVjT')
      .then((result) => {
        alert("Courrier envoyé")
        deleteData()
        history("/courrier")    
      }, (error) => {
          alert(error.text);
      });

  };
 useEffect(
   ()=>{
    verifyMail()
   },[]
 )
  return (
    <Box m="20px">
    <Header title="MAIL" subtitle="Envoie d'un mail" />


<form ref={form} onSubmit={sendEmail}>
      <TextField
                fullWidth
                variant="filled"
                type="text"
                value={name}
                name="user_name"
                sx={{ gridColumn: "span 4",marginBottom:"10px" }}
              />
                    <TextField
                fullWidth
                variant="filled"
                type="text"
                value={email}
                name="user_email"
                sx={{ gridColumn: "span 4",marginBottom:"10px" }}
              /> 
                      <TextField
          id="outlined-multiline-flexible"
          label="message"
          multiline
          fullWidth
          variant = "filled"
          name ="message"
          minRows={5}
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          sx={{ gridColumn: "span 4" }}
        /> 
                    <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Envoyer
              </Button>
            </Box>      

    </form>
  </Box>

  );
};
