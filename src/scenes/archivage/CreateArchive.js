import React,{useEffect,useState} from "react"
import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { MenuItem } from "@mui/material";
import {firestore} from "../../firebase.config"
import {doc,getDocs,Timestamp, orderBy,setDoc,collection,query} from "firebase/firestore"
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import {useNavigate} from "react-router-dom"
import { getAllItems } from "../../utils/firebaseFunctions";
import { getDownloadURL, uploadBytesResumable,ref, deleteObject } from 'firebase/storage'
import {BsFillCloudUploadFill} from "react-icons/bs"
import {storage} from "../../firebase.config"
import {AiOutlineFileText} from "react-icons/ai"


const CreateArchive = () => {

  const [executed,setExecuted] = useState(false)
  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const [date, setDate] = useState(new Date());
  const history = useNavigate()
  const [folder,setFolder] = useState()
  const [folders,setFolders] = useState([])
  const [imageAsset,setImageAsset] = useState("")
  const [type,setType] = useState("Fichier")
  const [isLoading,setIsLoading] = useState(false)
  const [msg,setMsg] = useState("")
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [name,setName] = useState("")
  const uploadImage = async (e) =>{      
    setIsLoading(true)
    if(imageAsset)
    {
        setImageAsset("")
        await deleteObject(ref(storage,imageAsset))
    }
    if(!e.target.files[0])
    {
        return 
    }
    const imageFile  = e.target.files[0]
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
            setIsLoading(false)
            setTimeout(()=>{
                 setMsg("")                  
            },4000)
        },
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
                setImageAsset(downloadUrl);
                setIsLoading(false)
                setName(imageFile.name)
                setTitle(imageFile.name)
                setMsg("Fichier ajouté au courrier 🙂 ")
                setTimeout(
                    ()=>{
                        setMsg("")
                    },4000
                )
            })
        }
    )
  }
  const fetchAllDatas = async () =>{
    setExecuted(true)  
    let data = await getAllItems("folders","name","asc")
    setFolders(data)
  }
  const saveDetails = async () =>{
    if(!title||!folder||!type||(!imageAsset&&!description))
    {
      alert("Veillez remplir tous les champs!")
      return
    }
    try{
          
 
                const data = {
                    id: new Date().getTime(),
                    title,
                    description,
                    folder,
                    imageAsset,
                    type,
                    name
                }
                try{
                    // for(let i = 0;i<images.length;i++)
                    // {
                    //     await setDoc(doc(firestore,"images",`${Date.now()}`),images[i],{merge:true})
                    // }
                    setIsLoading(true)
                    await setDoc(doc(firestore,"archives",`${Date.now()}`),data,{merge:true}).then(
                      ()=>{
                        alert("Archive enregistré")
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
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(type === "Manuelle" && imageAsset)
    {
        await deleteObject(ref(storage,imageAsset))
    }
    saveDetails()
  };

  useEffect(
    ()=>{
      if(executed)
      {
        return
      }
      fetchAllDatas()
      setExecuted(true)
    },[]
  )

  return (
    <Box m="20px">
      <Header title="Archives" subtitle="Enregistrer une archive" />
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
                label="Titre"
                name="titre"
                onChange={(e)=>setTitle(e.target.value)}
                value = {title}
                sx={{ gridColumn: "span 2" }}
              />
                    <TextField
          id="standard-select-currency"
          select
          variant ="filled"
          label="Dossier"
          name ="Dossier"
          value = {folder}
          onChange = {(e)=>setFolder(e.target.value?.name)}
          sx={{ gridColumn: "span 2" }}
        >
          {folders?.map((option) => (

               <MenuItem key={option} value={option}>
                  {option.name}
                </MenuItem>

          ))}

        </TextField>
          <TextField
          id="standard-select-currency"
          select
          variant ="filled"
          label="Type d'archive"
          name ="Type d'archive"
          onChange = {(e)=>setType(e.target.value)}
          value = {type}
          sx={{ gridColumn: "span 4" }}
        >
          {["Manuelle","Fichier"]?.map((option) => (

               <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>

          ))}

        </TextField>

  
           

     
{   type === "Manuelle" &&     <TextField
          id="outlined-multiline-flexible"
          label="Description"
          multiline
          variant = "filled"
          name ="description"
          value = {description}
          onChange = {(e)=>setDescription(e.target.value)}
          minRows={17}          
          sx={{ gridColumn: "span 4" }}
        />     }
 

            </Box>
            {
                type === "Fichier" &&  <div className="upload-file" style = {{marginTop:"35px"}}>
{                <label style = {{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",width:"100%"}}>
                    <input type = "file" onChange = {uploadImage}/>
                    
                     {
                  imageAsset && <div style = {{display:"flex",flexDirection:"column",alignItems:"center"}}>
                      
                           <AiOutlineFileText style = {{fontSize:"200px"}}/>
                           <span>{name}</span>

                      
                  </div>
                }
                {   !imageAsset  &&  <div style = {{textAlign:"center"}}>
                  <BsFillCloudUploadFill/>
                    <p>
                        Importer un fichier
                    </p>
                    <p style = {{margin:"10px 0"}}>
                    {msg && msg}
                    </p>  
                    </div>}
                </label>}

            </div>
            
            }
            <Box display="flex" justifyContent="end" mt="20px">
              <Button onClick = {saveDetails} sx = {{margin:"20px 0"}} disabled = {isLoading} type="submit" color="secondary" variant="contained">
                Enregistrer
              </Button>
            </Box>
          </form>
        
    </Box>
  );
};




export default CreateArchive;