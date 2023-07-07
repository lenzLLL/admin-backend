import React,{useState} from 'react'
import {ColorModeContext,useMode} from "./theme"
import {CssBaseline,ThemeProvider} from "@mui/material"
import Topbar from "./scenes/global/Topbar"
import {Routes,Route,BrowserRouter as Router} from "react-router-dom"
import Dashboard from './scenes/dashboard/Dashboard'
import Sidebar from './scenes/global/Sidebar'
import Offices from './scenes/Office/Office'
import Team from './scenes/team/Team'
import Mail from "./scenes/Mail/Mail"
import AddOffice from './scenes/Office/AddOffice'
import CreateTeam from './scenes/team/CreateTeam'
import Bar from './scenes/bar/Bar'
import CreateMail from './scenes/courrier/Courrier'
import CreateCommunity from './scenes/community/createCommunity'
import Community from './scenes/community/Community'
import Line from './scenes/line/Line'
import Profil from "./scenes/profil/Profil"
import Courrier2 from "./scenes/courrier/FIchiers"
import SaveOffices from "./scenes/courrier/Bureaux"
import { SendMail } from './scenes/sendMail/SendMail'
import Login from './scenes/login/Login'
import UpdateCommunity from "./scenes/community/UpdateCommunity"
import UpdateOffice from "./scenes/Office/updateOffice"
import UpdateTeam from './scenes/team/UpdateTeam'
import CreatePoste from './scenes/poste/CreatePoste'
import Postes from './scenes/poste/Postes'
import UpdatePoste from './scenes/poste/UpdatePoste'
import TC from './scenes/tp/Tp'
import CreateTc from './scenes/tp/CreateTp'
import UpdateTypeC from './scenes/tp/UpdateTc'
import OperatingOnEmail from './scenes/Mail/OperatingOnEmail'
import OperatingOnEmail2 from './scenes/Mail/OperatingOnEmail2'
import Folders from './scenes/folders/Folders'
import CreateFolder from './scenes/folders/CreateFolder'
import UpdateFolder from './scenes/folders/UpdateFolder'
import Archives from './scenes/archivage/Archives'
import CreateArchive from './scenes/archivage/CreateArchive'
import FolderDetails from './scenes/folders/FolderDetails'
import UpdateArchive from './scenes/archivage/updateArchive'

export default function App() {
  const [theme,colorMode] = useMode()
  const [isLogin,setIsLogin] = useState(false)
  React.useEffect(
      ()=>{
         if(localStorage.getItem("USER_COMMUNE"))
         {
             setIsLogin(true)
         }
         else{
             setIsLogin(false)
         } 
      },[]
  )
  return (

   <ColorModeContext.Provider value = {colorMode}>
       <ThemeProvider theme = {theme}> 
           <CssBaseline/> 
         {isLogin?   <div className ="app">
               <Sidebar/>
               <main className='content'>
                  
                  <Topbar/>
                  <Routes>
                      <Route exact path = "/" element = {<Dashboard/>}/>
                      <Route path = "/team" element = {<Team/>}/> 
                      <Route path ="/offices" element = {<Offices/>}/>
                      <Route path ="/mail" element = {<Mail/>}/>
                      <Route path ="/createoffice" element = {<AddOffice/>}/>
                      <Route path = "/createpersonnel" element = {<CreateTeam/>}/>
                      <Route path = "/bar" element = {<Bar/>}/>
                      <Route path ="/courrier" element = {<CreateMail/>}/>
                      <Route path ="/newmenber" element = {<CreateCommunity/>}/>
                      <Route path = "/community" element = {<Community/>}/>
                      <Route path ="/line" element = {<Line/>}/>
                      <Route path = "/profil" element = {<Profil/>}/>
                      <Route path ="/courrier2" element = {<Courrier2/>}/>
                      <Route path ="/courrier3" element = {<SaveOffices/>}/>
                      <Route path = "/send-mail" element = {<SendMail/>}/>
                      <Route path ="/updatecommunity/:id/:n" element = {<UpdateCommunity/>}/>
                      <Route path ="/updateteam/:id/:n" element = {<UpdateTeam/>}/>
                      <Route path ="/updateoffice/:id" element = {<UpdateOffice/>}/>
                      <Route path = "/createposte" element = {<CreatePoste/>}/>
                      <Route path = "/postes" element = {<Postes/>}/>
                      <Route path ="/updateposte/:id/:n" element = {<UpdatePoste/>}/>
                      <Route path ="/createtypecourrier" element = {<CreateTc/>}/>
                      <Route path ="/typecourrier" element = {<TC/>}/>
                      <Route path ="/updatetypecourrier/:id/:n" element = {<UpdateTypeC/>}/>
                      <Route path = "/operating-mail" element = {<OperatingOnEmail/>}/>
                      <Route path = "/operating-mail-2" element = {<OperatingOnEmail2/>}/>
                      <Route path = "/folders" element = {<Folders/>}/>
                      <Route path ="/createfolder" element ={<CreateFolder/>}/>
                      <Route path ="/updatefolder/:id/:n" element = {<UpdateFolder/>}/>
                      <Route path = "/archives" element = {<Archives/>}/>
                      <Route path = "/createarchive" element = {<CreateArchive/>} />
                      <Route path ="/folderdetails/:name" element = {<FolderDetails/>}/>
                      <Route path ="/folderupdate/:folder_param" element = {<UpdateArchive/>}/>
                      

                  </Routes> 
                  
               </main>
           </div>:<Login/>}
        </ThemeProvider>   
   </ColorModeContext.Provider> 
  )
}
