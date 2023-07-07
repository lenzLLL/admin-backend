import React,{useEffect,useState} from "react"
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import {v4 as uuidv4} from "uuid"
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { MenuItem } from "@mui/material";
import {firestore} from "../../firebase.config"
import {doc,getDocs,Timestamp,where,updateDoc,orderBy,setDoc,collection,query} from "firebase/firestore"
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { Stepper } from 'react-form-stepper'
import {useNavigate} from "react-router-dom"
import Select from 'react-select'
import emailjs from 'emailjs-com';
import { getAllItems, getItem, setStatsCourriers, updateAnyElementWithId } from "../../utils/firebaseFunctions";
import {mailUrl} from "../../utils/baseUrls"




const SaveOffices = () => {
  const [offices,setOffices] = useState([])
  const [executed,setExecuted] = useState(false)
  const [selectedOffices,setSelectedOffices] = useState([])
  const [isDisabled,setIsDisabled] = useState(false)
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const validSave = () => {
      let b = true;
      if(!localStorage.getItem("OFFICES_COURRIER"))
      { 
          b = false;
          return b;  
      }
      let items = JSON.parse(localStorage.getItem("OFFICES_COURRIER"))
      for(let i = 0;i<items.length;i++)
      {
       if(!items[i].delai)
       {
           b  = false;
           break;
       }
      }
      if(!showDate)
      {
        b = false;
      }
      return b;
  }
  const fetchData = async () =>{
    await  getAllItems("offices","name","asc").then(
         (data) =>{
              setSelectedOffices([])
              let table = []
              for(let i = 0;i<data?.length;i++)
              {
                table.push({value:data[i]?.name,label:data[i]?.name})
              }
              setSelectedOffices(table)
         }
      
     )



 }
 const getDateTime = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(date);  
}
  const [date, setDate] = useState(new Date());
  const [showDate,setShowDate] = useState(false)
  const [showButton,setShowButton] = useState(false)
  const [currentOffice,setCurrentOffice] = useState("")
  const customStyles = {
    option: (defaultStyles, state) => ({
      ...defaultStyles,
      color: state.isSelected ? "black" : "blue",
      backgroundColor: state.isSelected ? "green" : "white",
    }),

    control: (defaultStyles) => ({
      ...defaultStyles,
      backgroundColor: "#f3f3f3",
      padding: "8px",
      border: "1px solid rgba(0,0,0,0.222)",
      boxShadow: "none",
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#fff" }),
  };
  const history = useNavigate()

  const [isLoading,setIsLoading] = useState(false)
  const saveDetails = async (data) =>{
    
    try{
                try{

                    await setDoc(doc(firestore,"officescourrier",`${Date.now()}`),data,{merge:true})
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
  const saveAllFiles = async () =>{
    try {
        setIsLoading(true)
        let items = JSON.parse(localStorage.getItem("OFFICES_COURRIER"))
        let mail = JSON.parse(localStorage.getItem("SEND_MAIL_COMMUNE"))
        let message = mail.message
        let id = await getCourrier()
        const ref = doc(firestore,"courriers",id)
        await updateDoc(ref,{bureau:items[0].value,step:`1/${items.length}`}) 
        for(let i = 0;i < items.length;i++)
        {
            await saveDetails({
              id:uuidv4(),
              idCourrier:JSON.parse(localStorage.getItem("ID_COURRIER"))["id"],
              delais:items[i]?.delai,
              bureau:items[i].value,
              order:(i+1),
              rapport:"",
              status: i===0? "En cours":"En attente"
            })
            if(i == items.length-1)
            {
             await updateAnyElementWithId({delaiValidation:items[i]?.delai},JSON.parse(localStorage.getItem("ID_COURRIER"))["id"],"courriers") 
            }
            message += "nom: "+items[i].value+"     Délais de traitement: "+getDateTime(items[i].delai).toString()+"\n"
        }
        message +="\n\nCourrier en cours de traitement au bureau: "+items[0].value+"\n\nCordialement commune de Buea"
        mail.message = message

        setStatsCourriers()
        localStorage.setItem("SEND_MAIL_COMMUNE",JSON.stringify(mail)) 
        await setDoc(doc(firestore,"mails",`${Date.now()}`),{
            id:new Date().getTime(),
            idUser:JSON.parse(localStorage.getItem("CURRENT_USER"))["docId"],
            idCourrier:JSON.parse(localStorage.getItem("ID_COURRIER"))["id"],
            message:mail.message,
            status:"En cours"  
        },{merge:true})
        await fetch(`${mailUrl}/email/sendEmail`,{
          method:"POST",
          body:JSON.stringify({
            subject:`Hello ${mail.name}`,
            email:mail.email,
            message:message
          }),
          headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
          }
        }).then(
          (res)=>{

              localStorage.removeItem("ID_COURRIER")
              localStorage.removeItem("OFFICES_COURRIER_DEFAULT")
              localStorage.removeItem("OFFICES_COURRIER")
              localStorage.removeItem("FILES_COURRIER")
              localStorage.removeItem("SEND_MAIL_COMMUNE")
              history("/courrier")
              alert("Opération terminée")
              window.location.reload()
      

          }
        ) 

    }
    catch(error)
    {

    }
}
  const handleFormSubmit = (values) => {
    console.log(values);
    saveDetails(values.title,values.name,values.email,values.description)
  };
  const handleColor = (selectedOption) => {
    localStorage.setItem("OFFICES_COURRIER_DEFAULT",JSON.stringify(selectedOption))
    localStorage.setItem("OFFICES_COURRIER",JSON.stringify(selectedOption))

    const items = JSON.parse(localStorage.getItem("OFFICES_COURRIER_DEFAULT"))
    if(items.length > 0)
    {
      setShowButton(true)
    }
    else{
      setShowButton(false)
    }
    
};
 const changeCurrentIndexOffice = () =>{
  setExecuted(true) 
  if(localStorage.getItem("OFFICES_COURRIER"))
     {
      
        let items = JSON.parse(localStorage.getItem("OFFICES_COURRIER"))
        for(let i = 0;i<items.length;i++)
        {   
            if(!items[i].delai)
            {  
                setCurrentOffice(items[i].value)
                break
            }
        }  
     }
 }
 const saveDate = () => {
     let items = JSON.parse(localStorage.getItem("OFFICES_COURRIER"))
     for(let i = 0;i < items.length;i++)
     {
       if(!items[i].delai)
       {
         items[i].delai = date.getTime()
         break;
       }
     }
     localStorage.setItem("OFFICES_COURRIER",JSON.stringify(items))
     changeCurrentIndexOffice() 

 }
  useEffect(
    ()=>{
       if(executed)
       {
        return
       }
       fetchData()
       changeCurrentIndexOffice()
       if(localStorage.getItem("OFFICES_COURRIER_DEFAULT"))
       {
            if(JSON.parse(localStorage.getItem("OFFICES_COURRIER_DEFAULT"))?.length > 0)
            {
              setShowButton(true)
            }
            else{
              setShowButton(false)
            }

       }
       if(!localStorage.getItem("ID_COURRIER"))
       {
            history("/courrier")     
       }
       else{
         if(JSON.parse(localStorage.getItem("ID_COURRIER"))["step"] === 2)
         {
           history("/courrier2")
         }
         else if(JSON.parse(localStorage.getItem("ID_COURRIER"))["step"] === 3){
          history("/courrier3")
         }
         else if(JSON.parse(localStorage.getItem("ID_COURRIER"))["step"] === 4){
          history("/send-mail")
        }
       }
    },[showButton]
  )
  return (
    <Box m="20px">
      <Header title="COURRIER" subtitle="Enregistrer un courrier" />
      <Stepper
            steps={[{ label: 'Données' }, { label: 'Fichiers' }, { label: 'Bureaux' }]}
            activeStep={2}
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

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
              <div style = {{height:"30px"}}>

              </div>
{   !showDate &&( <>                               <Select
              isMulti
              name="colors"
              options={selectedOffices}
              className="basic-multi-select mt-4"
              classNamePrefix="select"
              styles={customStyles}
              defaultValue = {localStorage.getItem("OFFICES_COURRIER_DEFAULT")? JSON.parse(localStorage.getItem("OFFICES_COURRIER_DEFAULT")):[]}
              placeholder={'Choisir les couleurs du produit'}
              onChange={handleColor}
            />
                {            showButton &&                    <Button sx={{margin:"10px 0"}} onClick = {()=>setShowDate(true)} color="secondary" variant="contained">
                          suivant
                    </Button>}</> )}
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
                   
        
           
  
     
             {   showDate &&     <div style = {{width:"600px",display:"flex",flexDirection:"column"}}>
            <p>Delai de traitement du bureau {currentOffice}</p>
            <DateTimePicker style = {{width:"100%"}} onChange={setDate} value={date} />
            <button onClick = {()=>saveDate()} style = {{marginTop:"10px",width:"150px",borderRadius:"5px",cursor:"pointer",padding:"5px 0"}}>Enregistrer</button>
        </div>}
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
{      validSave() &&      <Box display="flex" justifyContent="end" mt="20px">
              <Button onClick={()=>saveAllFiles()} disabled = {isLoading} type="submit" color="secondary" variant="contained">
                Enregistrer
              </Button>
            </Box>}
          </form>
        )}
      </Formik>
    </Box>
  );
};


const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  description: yup.string().required("required"),
  email: yup.string().email("email invalide").required("required"),
  title: yup.string().required("required"),
  contact: yup.string().required("required"),
});
const initialValues = {
  name: "",
  description: "",
  title:"",
  contact: "",
  email: "",
};

const getCourrier = async () =>{
  const q = query(collection(firestore, "courriers"), where("id", "==", JSON.parse(localStorage.getItem("ID_COURRIER"))["id"]));
  const table = []
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    table.push(doc.id)

  });
  return table[0]
}

export default SaveOffices;