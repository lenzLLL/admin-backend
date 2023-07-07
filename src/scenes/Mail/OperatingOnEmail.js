import React,{useEffect,useState} from "react"
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {v4 as uuidv4} from "uuid"
import { MenuItem } from "@mui/material";
import {firestore} from "../../firebase.config"
import {doc,getDocs,Timestamp, orderBy,setDoc,collection,query} from "firebase/firestore"
import {storage} from "../../firebase.config"
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { getDownloadURL, uploadBytesResumable,ref, deleteObject } from 'firebase/storage'
import {BsFillCloudUploadFill} from "react-icons/bs"
import { Stepper } from 'react-form-stepper'
import { Upload, Icon, message } from 'antd';
import {useNavigate} from "react-router-dom";
import {MdDelete} from "react-icons/md"
import {BsFillFileEarmarkTextFill} from "react-icons/bs"
import {MdDownload} from "react-icons/md"
import {RxDoubleArrowRight} from "react-icons/rx"
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
const OperatingOnEmail = () => {
  const history = useNavigate()
  const [executed,setExecuted] = useState(false)
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [date, setDate] = useState(new Date());
  const [isLoading,setIsLoading] = useState(false)
  const [files,setFiles] = useState([])
  const [msg,setMsg] = useState("")
  const [imageAsset,setImageAsset] = useState("")
  const [alertStatus,setAlertStatus] = useState("")
  const uploadImage = async (e) =>{      
    setIsLoading(true)
    if(!e.target.files[0])
    {
        return 
    }
    const imageFile  = e.target.files[0]
    const {type} = e.target.files[0]
    const storageRef = ref(storage,`${Date.now()}-${imageFile.name}`)
    const uploadTask = uploadBytesResumable(storageRef,imageFile)
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
        ()=> {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
                setImageAsset(downloadUrl)
                setIsLoading(false)
                saveDetails(imageFile.name,imageAsset)
                alert("Fichier ajouté au courrier 🙂 ")
                setAlertStatus("success")
                setTimeout(
                    ()=>{
                        setMsg("")
                    },4000
                )

              

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


   const getAllItems = async (table,field,order ="desc") =>{
    const items = await getDocs(
        query(collection(firestore,table),orderBy(field,order))
    )
    return items.docs.map((doc)=>doc.data())
  }
  const fetchAllDatas = async () =>{
       setExecuted(true)
       await getAllItems("fichierscourrier","id","asc").then(
        (data)=>{
          let items = data.filter(item=>item.idCourrier === JSON.parse(localStorage.getItem("ASYNC_ID_OPERATING_MAIL")))
          setFiles(items)       
        }
      )

  }

  const { Dragger } = Upload;
  const goToMail2 = () => {
    let documents = "\nDocuments:\n";
    for(let i = 0 ; i<files.length;i++)
    {
        documents += files[i].name+"\n"
    }
    localStorage.setItem("DOCUMENTS_OPERATING_COMMUNE",JSON.stringify(documents))  
    history("/operating-mail-2")
    window.location.reload()
  }
  useEffect(
    ()=>{
       if(executed)
       {
          return
       }
       fetchAllDatas()
    },[fetchAllDatas(),files]
  )

  return (
    <Box m="20px">
      <Header title="COURRIER" subtitle="Traitement du courrier" />
      <Stepper
            steps={[{ label: 'Fichiers' }, { label: 'Rapport' }]}
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
           files.length > 0 && (
               files.map(
                   (item,index)=>{
                       return <div style = {{display:"flex",flexDirection:"row",justifyContent:"space-between",marginBottom:"5px",width:"50%",alignItems:"center"}}>
                           <div>
                               <BsFillFileEarmarkTextFill/>
                              <span style = {{marginLeft:"15px"}}> {item?.name} </span>
                           </div>
                           <a href = {item.url} download ><MdDownload style = {{cursor:'pointer'}}/></a>
                       </div>
                   }
               )
           )
       }
       {isLoading && <p style = {{color:"white"}}>Chargement ...</p>}
       </div>
       
        
            <Box display="flex" justifyContent="end" mt="20px">
            <Button type="submit" color="secondary" onClick = {goToMail2} variant="contained">
              <RxDoubleArrowRight/>
            </Button>
            </Box>
           
       
       
    </Box>
  );
};


export default OperatingOnEmail;
