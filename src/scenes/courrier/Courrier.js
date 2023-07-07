import React,{useEffect,useState} from "react"
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import {v4 as uuidv4} from "uuid"
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { MenuItem } from "@mui/material";
import {firestore} from "../../firebase.config"
import {doc,getDocs,Timestamp, orderBy,setDoc,collection,query} from "firebase/firestore"
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import emailjs from "emailjs-com"
import { Stepper } from 'react-form-stepper'
import {useNavigate} from "react-router-dom"




const CreateMail = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [user,setUser] = useState({
    name:"",
    phone:"",
    email:"",
    idDoc:""
  })
  const [executed,setExecuted] = useState(false)
  const [title,setTitle] = useState()
  const [description,setDescription] = useState()
  const [date, setDate] = useState(new Date());
  const [users,setUsers] = useState()
  const [tc,setTc] = useState([])
  const [name,setName] = useState("")
  const [titles,setTitles] = useState([])
  const history = useNavigate()
  const [isLoading,setIsLoading] = useState(false)
  const onSetUser = (data) =>{
      setUser(data)
      localStorage.setItem("CURRENT_USER",JSON.stringify(data))  
  }
  const getAllItems = async (table,field,order ="desc") =>{
    const items = await getDocs(
        query(collection(firestore,table),orderBy(field,order)))
    return items.docs.map((doc)=>doc.data()?.name)
  }
  const getAllUsers = async (table,field,order ="desc") =>{
    const items = await getDocs(
        query(collection(firestore,table),orderBy(field,order)))
    return items.docs.map((doc)=>doc.data())
  }
  const fetchAllDatas = async () =>{
    setExecuted(true)  
    await getAllUsers("community","name","asc").then(
        (data)=>{
          setUsers(data)         
        }
      )
      await getAllItems("typecourrier","name","asc").then(
        (data)=>{
            
            let items = [...data]
            setTitles(items)           
        }
      )
  }
  const saveDetails = async (title,email,description,phone,idUser) =>{
    try{
          
                const currentId = JSON.parse(localStorage.getItem("ID_COURRIER"))
                // const images = JSON.parse(localStorage.getItem("images"))
                const data = {
                    id: currentId["id"],
                    user:user.name,
                    description,
                    email,
                    step:"",
                    title,
                    bureau:"",
                    status:"En cours",
                    idUser,
                    phone,
                    delaiValidation:0,
                    dateEnregistrement:date.getTime(),
                    dateReception:new Date().getTime(),
                    dateValidation:0,
                    sent:false
                }
                try{
                    // for(let i = 0;i<images.length;i++)
                    // {
                    //     await setDoc(doc(firestore,"images",`${Date.now()}`),images[i],{merge:true})
                    // }
                    setIsLoading(true)
                    await setDoc(doc(firestore,"courriers",`${Date.now()}`),data,{merge:true}).then(
                      ()=>{
                        let cr = JSON.parse(localStorage.getItem("ID_COURRIER"))
                        cr["step"] = 2
                        cr["prevDate"] = date
                        localStorage.setItem("ID_COURRIER",JSON.stringify(cr))
                        localStorage.setItem("SEND_MAIL_COMMUNE",JSON.stringify({type:"cr",name:data.user,email:data.email,message:"Nous avons le plaisir de vous annoncer l'enregistrement de votre courrier dans notre base de données, le processus de traitement commencera immédiatement\n\nDocuments:\n\n"}))
                        alert("courrier ajouter")
                        history("/courrier2")  
                        window.location.reload()
                      }
                    )
                  
                }
                catch(error)
                {
                    alert(error)
                }
    }
    catch(error)
    {
    alert("Error")
    }
}
  const handleSubmit = (e) => {
    e.preventDefault()
    if(!user||!title||!description)
    {
      alert("Veillez remplir tous les champs!")
      return
    }
    saveDetails(title,user?.email,description,user?.phone,user?.docId)
  };

  useEffect(
    ()=>{
      if(executed)
      {
        return
      }
      fetchAllDatas()
       if(!localStorage.getItem("ID_COURRIER"))
       {
        const data = {
          id:Date.now(),
          step:1  
        } 
        localStorage.setItem("ID_COURRIER",JSON.stringify(data))
             
       }
       else{
         if(JSON.parse(localStorage.getItem("ID_COURRIER"))["step"] === 2)
         {
           history("/courrier2")
           window.location.reload()
         }
         else if(JSON.parse(localStorage.getItem("ID_COURRIER"))["step"] === 3){
          history("/courrier3")
          window.location.reload()
         }
         else if(JSON.parse(localStorage.getItem("ID_COURRIER"))["step"] === 4){
           history("/send-mail")
           window.location.reload()
         }
         
       }
       setExecuted(true)
    },[]
  )

  return (
    <Box m="20px">
      <Header title="COURRIER" subtitle="Enregistrer un courrier" />
      <Stepper
            steps={[{ label: 'Données' }, { label: 'Fichiers' }, { label: 'Bureaux' }]}
            activeStep={0}
            styleConfig={{
              activeBgColor: '#2b7cff',
              activeTextColor: '#fff',
              inactiveBgColor: '#fff',
              inactiveTextColor: '#2b7cff',
              completedBgColor: '#fff',
              completedTextColor: '#2b7cff',
              size: '2em'
            }}
            className={'stepper'}
            stepClassName={'stepper__step'}
          />

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
          id="standard-select-currency"
          select
          variant ="filled"
          label="Titre"
          name ="title"
          value = {title}
          onChange = {(e)=>setTitle(e.target.value)}
          sx={{ gridColumn: "span 2" }}
        >
          {titles?.map((option) => (

               <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>

          ))}

        </TextField>
          <TextField
          id="standard-select-currency"
          select
          variant ="filled"
          label="Client"
          name ="name"
          onChange = {(e)=>setName(e.target.value)}
          value = {name}
          sx={{ gridColumn: "span 2" }}
        >
          {users?.map((option) => (

               <MenuItem onClick = {()=>onSetUser(option)} key={option} value={option}>
                  {option?.name}
                </MenuItem>

          ))}

        </TextField>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="contact"
                name="contact"
                value = {user?.phone}
                sx={{ gridColumn: "span 2" }}
              />
  
                            <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                name="email"
                value = {user?.email}
                sx={{ gridColumn: "span 2" }}
              />

     
        <TextField
          id="outlined-multiline-flexible"
          label="Description"
          multiline
          variant = "filled"
          name ="description"
          value = {description}
          onChange = {(e)=>setDescription(e.target.value)}
          minRows={4}          
          sx={{ gridColumn: "span 4" }}
        />
        <div style = {{width:"600px"}}>
            <p>Date d'enregistrement</p>
            <DateTimePicker style = {{width:"100%"}} onChange={setDate} value={date} />
        </div>
        {/* <Button variant="contained" component="label" 
              sx={{
                backgroundColor:"success.main",
                color: 'white',
                '& .MuiSlider-thumb': {
                  borderRadius: '1px',
                },
              }}
        >
                  Importer les fichiers
                 <input hidden accept="image/*" multiple type="file" />
        </Button> */}
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button sx = {{margin:"20px 0"}} disabled = {isLoading} type="submit" color="secondary" variant="contained">
                Enregistrer
              </Button>
            </Box>
          </form>
        
    </Box>
  );
};




export default CreateMail;