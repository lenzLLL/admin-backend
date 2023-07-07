import React,{useEffect,useState,useRef} from "react"
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {v4 as uuidv4} from "uuid"
import { MenuItem } from "@mui/material";
import {firestore} from "../../firebase.config"
import {doc,getDocs,Timestamp, orderBy,setDoc,collection,query,where} from "firebase/firestore"
import {storage} from "../../firebase.config"
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { getDownloadURL, uploadBytesResumable,ref, deleteObject } from 'firebase/storage'
import {BsFillCloudUploadFill, BsMailbox} from "react-icons/bs"
import { Stepper } from 'react-form-stepper'
import { Upload, Icon, message } from 'antd';
import {useNavigate} from "react-router-dom";
import {MdDelete, MdMail} from "react-icons/md"
import {BsFillFileEarmarkTextFill} from "react-icons/bs"
import {MdDownload} from "react-icons/md"
import {RxDoubleArrowLeft,RxDoubleArrowRight} from "react-icons/rx"
import { setStatsCourriers, updateAnyElementWithId } from "../../utils/firebaseFunctions";
import { fisrtParameter, secondParameter } from "../../data/mail_data";
import emailjs from "emailjs-com"
import { mailUrl } from "../../utils/baseUrls";
const { Dragger } = Upload;

const filterFile = async (url) =>{
    const items = JSON.parse(localStorage.getItem("FILES_COURRIER"))
    const newItems = items.filter((item)=>item.url != url)

    localStorage.setItem("FILES_COURRIER",JSON.stringify(newItems))
    try{
    await deleteObject(ref(storage,url))
    window.location.reload()
    }
    catch(error)
    {

    }
}

const saveDetails = async (name,url) =>{
    try{
          
                
                // const images = JSON.parse(localStorage.getItem("images"))
                const data = {
                    id:uuidv4(),
                    idCourrier:JSON.parse(localStorage.getItem("ASYNC_ID_OPERATING_MAIL")),
                    name,
                    url
                }
                try{
                    // for(let i = 0;i<images.length;i++)
                    // {
                    //     await setDoc(doc(firestore,"images",`${Date.now()}`),images[i],{merge:true})
                    // }
                    await setDoc(doc(firestore,"fichierscourrier",`${Date.now()}`),data,{merge:true})
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
const OperatingOnEmail2 = () => {
  const form = useRef();
  const msgRef = useRef(null);
  const history = useNavigate()
  const [open, setOpen] = useState(false);
  const [executed,setExecuted] = useState(false)
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [date, setDate] = useState(new Date());
  const [isLoading,setIsLoading] = useState(false)
  const [status,setStatus] = useState("")
  const [description,setDescription] = useState("")
  const [files,setFiles] = useState([])
  const [email,setEMail] = useState("")
  const [message,setMessage] = useState("")
  const [name,setName] = useState("")
  const [msg,setMsg] = useState("")
  const [items,setItems] = useState([])
  const [imageAsset,setImageAsset] = useState("")
  const [alertStatus,setAlertStatus] = useState("")
  const getItem = async (t,id) =>{
    const q = query(collection(firestore,t), where("id", "==",id));
    const table = []
    const querySnapshot = await getDocs(q);
    const data = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      table.push(doc.id)
      data.push(doc.data())
    });
    let final = []
    final.push(table)
    final.push(data)
    return final
  }
  const getDateTime = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(date);  
  }
  const sendMail = async (message,idUser,idCourrier,status) => {
    await setDoc(doc(firestore,"mails",`${Date.now()}`),{
      id:new Date().getTime(),
      idUser:idUser,
      idCourrier:idCourrier,
      message:message,
      status
    })  
  }
  const validateCourrier = async () =>{
    if(!status || !description)
    {
      alert("veillez remplir tous les champs!")
      return;
    }
    let status ="" 
    let courrier = await getItem("courriers",JSON.parse(localStorage.getItem("ASYNC_ID_OPERATING_MAIL")))
    setItems(state => [...state,{order:-100}])
    let currentOfficeCourrrier = items.filter(item=>item.bureau === courrier[1][0].bureau)
    let nextOfficeCourrier = items.filter(item=>item.order === currentOfficeCourrrier[0].order+1)
    let prevOfficeCourrier = items.filter(item=>item.order === currentOfficeCourrrier[0].order-1)
    let m =  description
     if(status === "Valider le courrier")
     {
        
          await updateAnyElementWithId({status:"Validé",rapport:description},currentOfficeCourrrier[0].id,"officescourrier")
          if(nextOfficeCourrier.length > 0)
          {
               m = `Statut du courrier: Validé par le bureau ${currentOfficeCourrrier[0].bureau}\n\nRapport: `+ m+"\n\nCourrier en cours de traitement au bureau: "+nextOfficeCourrier[0].bureau+"\nDélais de traitement: "+getDateTime(nextOfficeCourrier[0].delais)          
               status = "En cours"
               await updateAnyElementWithId({status:"En cours",bureau:nextOfficeCourrier[0].bureau,dateReception:new Date().getTime(),step:`${nextOfficeCourrier[0].order}/${items.length}`},JSON.parse(localStorage.getItem("ASYNC_ID_OPERATING_MAIL")),"courriers")            
               await updateAnyElementWithId({status:"En cours"},nextOfficeCourrier[0].id,"officescourrier")
          }
          else{
               m = `Statut du courrier: Votre courrier a été traité avec success par tous les bureaux notament ${currentOfficeCourrrier[0].bureau}\n\nRapport: `+ m          
               status = "Validé"
               await updateAnyElementWithId({status:"Validé",dateValidation:new Date().getTime()},JSON.parse(localStorage.getItem("ASYNC_ID_OPERATING_MAIL")),"courriers")            
           }
    }
    else if(status === "Rejeter le courrier")
    {
        m = `Statut du courrier: Votre courrier a été rejeté par le bureau: ${currentOfficeCourrrier[0].bureau}\n\nrapport: `+ m          
        status = "Rejeté"
        await updateAnyElementWithId({status:"Rejeté"},JSON.parse(localStorage.getItem("ASYNC_ID_OPERATING_MAIL")),"courriers")
        await updateAnyElementWithId({status:"Rejeté",rapport:description},currentOfficeCourrrier[0].id,"officescourrier") 
    }
    else if(status === "Renvoyer le courrier")
    {
         if(prevOfficeCourrier.length > 0)
         {
              m = `Statut du courrier: Votre courrier a été renvoyé par le bureau: ${currentOfficeCourrrier[0].bureau} vers ${prevOfficeCourrier[0].bureau} \n\nRapport: `+ m          
              status = "Renvoyé"
              await updateAnyElementWithId({status:"Renvoyé",rapport:description},currentOfficeCourrrier[0].id,"officescourrier")
              await updateAnyElementWithId({status:`Renvoyé`,rapport:description},prevOfficeCourrier[0].id,"officescourrier")
              await updateAnyElementWithId({status:"Renvoyé",bureau:prevOfficeCourrier[0].bureau,dateReception:new Date().getTime(),step:`${prevOfficeCourrier[0].order}/${items.length}`},JSON.parse(localStorage.getItem("ASYNC_ID_OPERATING_MAIL")),"courriers")            
         }
         else{
             alert("Impossible de renvoyer le courrier, car vous êtes le premier bureau")
             return
         }
    }
    else{
      m = `Statut du courrier: Votre courrier a été suspendu par le bureau: ${currentOfficeCourrrier[0].bureau}\n\nRapport: `+ m          
      status = "Suspendu"
      await updateAnyElementWithId({status:"Suspendu",rapport:description},currentOfficeCourrrier[0].id,"officescourrier")
      await updateAnyElementWithId({status:"Suspendu"},JSON.parse(localStorage.getItem("ASYNC_ID_OPERATING_MAIL")),"courriers")            
    }
    let docs = JSON.parse(localStorage.getItem("DOCUMENTS_OPERATING_COMMUNE"))
    m += "\n"+docs
    setStatsCourriers()
    await sendMail( m,courrier[1][0].idUser,courrier[1][0].id,status)
    await fetch(`${mailUrl}/email/sendEmail`,{
      method:"POST",
      body:JSON.stringify({
        subject:`Hello ${name}`,
        email:email,
        message:m
      }),
      headers:{
        Accept:"application/json",
        "Content-Type":"application/json"
      }
    }).then(
      async (res)=>{
        if(res.status > 199 && res.status<3000)
        {
          m = ""
          localStorage.removeItem("ID_COURRIER")
          localStorage.removeItem("OFFICES_COURRIER_DEFAULT")
          localStorage.removeItem("OFFICES_COURRIER")
          localStorage.removeItem("FILES_COURRIER")
          localStorage.removeItem("SEND_MAIL_COMMUNE")
          alert("Opération terminée 🙂 ")
          history("/mail")
          
        }

      }
    ) 
    setIsLoading(true)
  }



   const getAllItems = async (table,field,order ="desc") =>{
    const items = await getDocs(
        query(collection(firestore,table),orderBy(field,order))
    )
    return items.docs.map((doc)=>doc.data())
   }
  const fetchAllDatas = async () =>{
      await getAllItems("officescourrier","id","asc").then(
        (data)=>{
          let items = data.filter(item=>item.idCourrier === JSON.parse(localStorage.getItem("ASYNC_ID_OPERATING_MAIL")))    
          setItems(items)
        }
      )
    let courrier = await getItem("courriers",JSON.parse(localStorage.getItem("ASYNC_ID_OPERATING_MAIL")))
    setName(courrier[1][0].user)
    setEMail(courrier[1][0].email)
    setExecuted(true)
  }
  const { Dragger } = Upload;
  const goToMail = () => {
    history("/operating-mail")
    window.location.reload()
  }
  useEffect(
    ()=>{
       if(executed)
       {
          return
       }
       fetchAllDatas()
    },[]
  )

  return (
    <Box m="20px">
      <Header title="COURRIER" subtitle="Traitement du courrier" />
      <Stepper
            steps={[{ label: 'Fichiers' }, { label: 'Rapport' }]}
            activeStep={1}
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

          <div  style = {{display:"flex",marginBottom:"10px", flexDirection:"column",gap:"15px"}} >
          
          <TextField
          id="standard-select-currency"
          select
          fullWidth
          variant ="filled"
          label="Sélectionner l'état du courrier"
          name ="name"
          value = {status}
          onChange={(e)=>setStatus(e.target.value)}

          sx={{ gridColumn: "span 2" }}
        >
          {["Valider le courrier","Rejeter le courrier","Renvoyer le courrier","Suspendre le courrier"].map((option) => (

               <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>

          ))}

        </TextField>
        <TextField
          id="outlined-multiline-flexible"
          label="Votre rapport"
          multiline
          fullWidth
          variant = "filled"
          name ="description"
          minRows={4}
          value = {description}
          onChange={(e)=>setDescription(e.target.value)}
          
          sx={{ gridColumn: "span 4" }}
        />    
       
    

            <div style = {{display:"flex",gap:"20px",justifyContent:'space-between'}}>
            <Box display="flex" justifyContent="end" mt="20px">
            <Button type="submit" color="secondary" onClick = {goToMail} variant="contained">
              <RxDoubleArrowLeft/>
            </Button>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
            <Button   disabled = {isLoading} type="submit" color="secondary" onClick = {()=>validateCourrier()} variant="contained">
              Enregistrer
            </Button>
            </Box>

         </div>
  
          </div>       
       <div style = {{height:"25px"}}>

       </div>
    </Box>
    
  );
};


export default OperatingOnEmail2;
