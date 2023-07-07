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
import {storage} from "../../firebase.config"
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import "./fichiers.css"
import { getDownloadURL, uploadBytesResumable,ref, deleteObject } from 'firebase/storage'
import {BsFillCloudUploadFill} from "react-icons/bs"
import { Stepper } from 'react-form-stepper'
import { Upload, Icon, message } from 'antd';
import {useNavigate} from "react-router-dom";
import {MdDelete} from "react-icons/md"
import {BsFillFileEarmarkTextFill} from "react-icons/bs"
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
const saveDetails = async (id,idCourrier,name,url) =>{
    
    try{
          
                
                // const images = JSON.parse(localStorage.getItem("images"))
                const data = {
                    id,
                    idCourrier,
                    name,
                    url
                }
                try{
                    // for(let i = 0;i<images.length;i++)
                    // {
                    //     await setDoc(doc(firestore,"images",`${Date.now()}`),images[i],{merge:true})
                    // }
                    await setDoc(doc(firestore,"fichierscourrier",`${Date.now()}`),data,{merge:true})
                    const ID = JSON.parse(localStorage.getItem("ID_COURRIER"))
                    ID["step"] = 3
                    localStorage.setItem("ID_COURRIER",JSON.stringify(ID))
                    window.location.reload()
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
const UploadFilesMail = () => {
  const history = useNavigate()
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [date, setDate] = useState(new Date());
  const [isLoading,setIsLoading] = useState(false)
  const [msg,setMsg] = useState("")
  const [imageAsset,setImageAsset] = useState("")
  const [alertStatus,setAlertStatus] = useState("")
  const [executed,setExecuted] = useState(false)
  const uploadImage = (e) =>{      
    setIsLoading(true)
    if(!e.target.files[0])
    {
        return 
    }
    const imageFile  = e.target.files[0]
    const {type} = e.target.files[0]
    // if(type === "image/png" || type === "image/svg" || type === "image/jpeg" || type === "image/gif" || type === "image/tiff"||type === "image/jpg"  )
    // {       
    // }
    // else{
    //     setIsLoading(false)
    //     setAlertStatus("danger")
    //     setMsg("extensions acceptables (png, svg, jpeg, jpg, gif, tiff)")
    //     setTimeout(() => {
    //         setMsg("") 
    //     }, 4000);
    //     return
    // }
    console.log(type)
    const storageRef = ref(storage,`${Date.now()}-${imageFile.name}`)
    const uploadTask = uploadBytesResumable(storageRef,imageFile)
    const fullImages = JSON.parse(localStorage.getItem("FILES_COURRIER"))
    // if(fullImages?.length === 5)
    // {
    //     setIsLoading(false)
    //     setAlertStatus("danger")
    //     setMsg("Vous ne pouvez pas entrer plus de 5 images")
    //     setTimeout(
    //         ()=>{
    //              setMsg("")
    //         },4000
    //     )
    //     return
        
    // }
  
    uploadTask.on(
        "state_changed",
        (snapshot) =>{
            const uploadProgress = (snapshot.bytesTransferred/snapshot.totalBytes)*100
        },
        (error)=>{
            console.log(error)
            setMsg("Erreur pendant l'ajout du fichier, s'il vous plait veillez ressayer 🙇 ");
            setAlertStatus("danger")
            setIsLoading(false)
            setTimeout(()=>{
                 setMsg("")                  
            },4000)
        },
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
                alert("cool")
                setImageAsset(downloadUrl);
                setIsLoading(false)
                setMsg("Fichier ajouté au courrier 🙂 ")
                setAlertStatus("success")
                setTimeout(
                    ()=>{
                        setMsg("")
                    },4000
                )
                if(!localStorage.getItem("FILES_COURRIER"))
                {
                  localStorage.setItem("FILES_COURRIER",JSON.stringify([{
                      id:uuidv4(),
                      idCourrier:JSON.parse(localStorage.getItem("ID_COURRIER"))["id"],
                      url:downloadUrl,
                      name:imageFile.name
                  }]))
                }
                else{
                    const images = [...JSON.parse(localStorage.getItem("FILES_COURRIER"))]
                    images.push({
                        id:uuidv4(),
                        idCourrier:JSON.parse(localStorage.getItem("ID_COURRIER"))["id"],
                        url:downloadUrl,
                        name:imageFile.name
                    }) 
                

                    localStorage.setItem("FILES_COURRIER",
                          JSON.stringify(images)
                 )
               
            
                }
              

            })
        }
    )

}
const saveAllFiles = async () =>{
    try {
        let items = JSON.parse(localStorage.getItem("FILES_COURRIER"))
        let mail = JSON.parse(localStorage.getItem("SEND_MAIL_COMMUNE"))
        let message = mail.message 
        for(let i = 0;i < items.length;i++)
        {
            await saveDetails(items[i].id,items[i].idCourrier,items[i].name,items[i].url)
            message += items[i].name+"\n"
            alert("cool")
        }
        message += "\nBureaux:\n\n"
        mail.message = message
        localStorage.setItem("SEND_MAIL_COMMUNE",JSON.stringify(mail)) 
        alert("fichiers conservés")
        let cr = JSON.parse(localStorage.getItem("ID_COURRIER"))
        cr["step"] = 3
        localStorage.setItem("ID_COURRIER",JSON.stringify(cr))
        history("/courrier3")
    }
    catch(error)
    {

    }
}
  const Postes = [
      "Comptable",
      "Sécrétaire",
      "Technicien"
  ]
  const Bureaux = [
      "Gsp 4",
      "Gsp 4","Gsp 4","Gsp 4",
  ]
  const Privilèges = [
    "Utilisateur"  ,
    "Administrateur",
    "chef de bureau"

  ]

  const { Dragger } = Upload;

  useEffect(
    ()=>{
        if(executed)
        {
            return
        }
        setExecuted(true)
        if(!localStorage.getItem("ID_COURRIER"))
        {
             history("/courrier")    
        }
        else{
         if(JSON.parse(localStorage.getItem("ID_COURRIER"))["step"] === 1)
         {
           history("/courrier")
         }
         else if(JSON.parse(localStorage.getItem("ID_COURRIER"))["step"] === 3){
          history("/courrier3")
         }
         else if(JSON.parse(localStorage.getItem("ID_COURRIER"))["step"] === 4){
             history("/send-mail")
           }
        }
        
    
    },[]
  )

  return (
    <Box m="20px">
      <Header title="COURRIER" subtitle="Enregistrer un courrier" />
      <Stepper
            steps={[{ label: 'Données' }, { label: 'Fichiers' }, { label: 'Bureaux' }]}
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
        <div className="upload-file">
            <label style = {{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
                <input type = "file" onChange = {uploadImage}/>
                 <BsFillCloudUploadFill/>
                <p>
                    Importer les fichiers relatifs au courrier
                </p>
                <p style = {{margin:"10px 0"}}>
                {msg && msg}
                </p>
            </label>
        </div>  
        <div style = {{marginTop:"50px"}}>
       {
           localStorage.getItem("FILES_COURRIER") && (
               JSON.parse(localStorage.getItem("FILES_COURRIER")).map(
                   (item,index)=>{
                       return <div style = {{display:"flex",flexDirection:"row",justifyContent:"space-between",marginBottom:"5px",width:"50%",alignItems:"center"}}>
                           <div>
                               <BsFillFileEarmarkTextFill/>
                              <span style = {{marginLeft:"15px"}}> {item?.name} </span>
                           </div>
                           <MdDelete style = {{cursor:'pointer'}} onClick = {()=>filterFile(item.url)}/>
                       </div>
                   }
               )
           )
       }
       {isLoading && <p style = {{color:"white"}}>Chargement ...</p>}
       </div>
       {
           localStorage.getItem("FILES_COURRIER") && (
            <Box display="flex" justifyContent="end" mt="20px">
            <Button type="submit" color="secondary" onClick = {()=>saveAllFiles()} variant="contained">
              Enregistrer
            </Button>
          </Box>
           )
       }
       
    </Box>
  );
};


export default UploadFilesMail;
