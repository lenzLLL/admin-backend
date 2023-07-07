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
import {Link, useNavigate, useParams} from "react-router-dom"
import { getAllItems, getItem, updateAnyElementWithId } from "../../utils/firebaseFunctions";
import { getDownloadURL, uploadBytesResumable,ref, deleteObject } from 'firebase/storage'
import {BsFillCloudUploadFill} from "react-icons/bs"
import {storage} from "../../firebase.config"
import {AiOutlineFileText} from "react-icons/ai"


const UpdateArchive = () => {

  const [executed,setExecuted] = useState(false)
  const [showRendu,setShowRendu] = useState(false)
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
  const [newAssetImage,setNewAssetImage] = useState("")
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [name,setName] = useState("")
  const uploadImage = async (e) =>{      
    setIsLoading(true)
    if(newAssetImage)
    {
        setImageAsset("")
        await deleteObject(ref(storage,newAssetImage))
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
                setNewAssetImage(downloadUrl);
                setIsLoading(false)
                setName(imageFile.name)
                setTitle(imageFile.name)
                localStorage.setItem("NewAssetImage",JSON.stringify(downloadUrl))
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
    let data = await getItem("archives",JSON.parse(localStorage.getItem("ASYNC_ID")))
    setTitle(data.title)
    setFolder(data.folder)
    setImageAsset(data.imageAsset)
    setType(data.type)
    setName(data.name)
    setDescription(data.description)
    data = await getAllItems("folders","name","asc")
    setFolders(data)  
  }
  const saveDetails = async () =>{
    if(!title||!folder||!type||(!imageAsset&&!description))
    {
      alert("Veillez remplir tous les champs!")
      return
    }
    if(newAssetImage)
    {
        await deleteObject(ref(storage,imageAsset))      
    }
    try{
          
    
                const data = {
                    id: new Date().getTime(),
                    title,
                    description,
                    folder,
                    imageAsset:newAssetImage? newAssetImage:imageAsset,
                    type,
                    name:name
                }
                try{
                    // for(let i = 0;i<images.length;i++)
                    // {
                    //     await setDoc(doc(firestore,"images",`${Date.now()}`),images[i],{merge:true})
                    // }
                    setIsLoading(true)
                    await updateAnyElementWithId(data,JSON.parse(localStorage.getItem("ASYNC_ID")),"archives").then(
                      ()=>{
                        alert("Archive modifié")
                        history("/archives")
                        localStorage.removeItem("NewAssetImage")
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

      if(JSON.parse(localStorage.getItem("NewAssetImage")))
      {
        setNewAssetImage(JSON.parse(localStorage.getItem("NewAssetImage")))
      }
      fetchAllDatas()
      setExecuted(true)
    },[]
  )

  return (
    <Box m="20px">
      <Header title="Archives" subtitle="Modifier une archive" />
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
                    
                     
                  <div style = {{display:"flex",flexDirection:"column",alignItems:"center"}}>
                      
                           <AiOutlineFileText style = {{fontSize:"200px"}}/>
                           <span>{name}</span>

                      
                  </div>
                

                </label>}

            </div>
            
            }
            <Box display="flex" justifyContent="end" gap={"10px"} mt="20px">
            {   type === "Fichier" &&      <Button  sx = {{margin:"20px 0"}}  color="secondary" variant="contained">
                <Link to = {imageAsset}  style={{textDecoration:"none",color:"#000"}}> Télécharger le fichier</Link>
              </Button>}
              <Button onClick = {saveDetails} sx = {{margin:"20px 0"}}  type="submit" color="secondary" variant="contained">
                Modifier
              </Button>

            </Box>
          </form>
        
    </Box>
  );
};




export default UpdateArchive;