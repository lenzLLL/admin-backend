import React,{useEffect,useState} from "react"
import { Box } from "@mui/material";
import { useNavigate,useParams } from "react-router-dom";
import Header from "../../components/Header";
import { getAllItems } from "../../utils/firebaseFunctions";
import {BsFillFileEarmarkTextFill} from "react-icons/bs"
import {BiSolidFileTxt} from "react-icons/bi"

function FolderDetails(){
    const history = useNavigate()
    const {name} = useParams()
    const [executed,setExecuted] = useState(false)
    const [data,setData] = useState([])
    const goToUpdate = (id) => {
      history("/folderupdate/"+name)
      localStorage.setItem("ASYNC_ID",JSON.stringify(id))  
  }
    const fetchData = async () =>{
        await  getAllItems("archives","title","asc").then(
             (data) =>{
    
                    setData(data.filter(item=>item.folder === name))
             }
          
         )
         setExecuted(true)
    
     }
    useEffect(
        ()=>{
            if(executed)
            {
                return
            }
            fetchData()
            setExecuted(true)

        },[]
    ) 
    return     <Box m="20px">
               <Header title="Archives" subtitle={`Liste des archives de la catégorie ${name}`} />
               <div style = {{display:"flex",gap:"55px",flexWrap:"wrap",marginTop:"30px"}}>
          {
            data.map(
              (d)=>{
                return(
                  <div onClick = {()=>goToUpdate(d.id)} style = {{display:"flex",width:"170px",flexDirection:"column",cursor:"pointer",justifyContent:"center",alignItems:"center"}}>
                      
                          {d.type !== "Manuelle"? <BsFillFileEarmarkTextFill style = {{fontSize:"100px"}}/>: <BiSolidFileTxt style = {{fontSize:"100px"}}/>}
                      
                      <h2 style = {{color:"white",textAlign:"center"}}>{d.title}</h2>
                  </div>
                )
              }
            )
          }
      </div>

               </Box>
}

export default FolderDetails