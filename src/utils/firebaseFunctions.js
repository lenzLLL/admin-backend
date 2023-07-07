import {doc,getDocs,orderBy,setDoc,or,collection,query,where,deleteDoc, updateDoc,} from "firebase/firestore"
import { firestore } from "../firebase.config"
import { storage } from "../firebase.config"
import {ref, deleteObject } from "firebase/storage"
import { mailUrl } from "./baseUrls"


export const saveItem = async (table,data) =>{
    await setDoc(doc(firestore,"products",`${Date.now()}`),data,{merge:true})
}

export const createDocInFireStore = async (table,data) =>{
    await setDoc(doc(firestore,table,`${Date.now()}`),data,{merge:true})
}
export const CreateManyDocsInFireStore = async (table,datas) =>{
    for(let i = 0;i<datas.length;i++)
    {
      createDocInFireStore(table,datas[i])
    }
}

export const saveManyItems = async (table,items) =>{
    for(let i = 0; i <= table.length;i++)
    {
        saveItem(table,items[i])
    }
}

export const getAllItems = async (table,field,order ="desc") =>{
    const items = await getDocs(
        query(collection(firestore,table),orderBy(field,order))
    )
 
  
    return items.docs.map((doc)=>doc.data())
  }
export const getArchivesBySearch = async (text)=>{
    const q = query(collection(firestore, "archives"));   
    const table = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      table.push(doc.data())
    });
    let temp = 0;
    let finalData = []
    for(let i = 0;i<table.length;i++)
    {
        const description = table[i].description
        let itsMatch = true
        for(let i = 0;i<description.length;i++)
        {   
            itsMatch = true
            if(description[i].toLowercase() === text[0])
            {  temp = i;
              for(let i= 0;i<text.length;i++)
              {
                if(description[temp+i] !== text[i])
                { 
                  itsMatch = false
                  return
                }
              }
            }
            if(itsMatch)
            {
                finalData.push(table[i])     
            }   
        }
 
    }
    return finalData
  }
export const deleteProductById = async (id) =>{
    const q = query(collection(firestore, "products"), where("id", "==", id));
    const table = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      table.push(doc.id)
    });
    var answer = window.confirm("Voulez vous vraiment supprimer?");
    if (answer) {
        await deleteDoc(doc(firestore,"products",table[0]))
      
    }
    else {
    //some code
    }
  

}

export const getItem = async (t,id) =>{
    const q = query(collection(firestore, t), where("id", "==", id));
    const table = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      table.push(doc.data())
    });
    return table[0]
}

export const getCategory = async (id) =>{
  const q = query(collection(firestore, "categories"), where("id", "==", id));
  const table = []
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    table.push(doc.data())
  });
  return table[0]
}

export const getAllImages = async (id) =>{
    const q = query(collection(firestore, "images"), where("idProduct", "==", id));
    const table = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      table.push({...doc.data(),docId:doc.id})

    });
    return table    
}

export const deleteImageById = async (id) =>{
    
    const q = query(collection(firestore, "images"), where("id", "==", id));
    const table = []
    const url = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      table.push(doc.id)
      url.push(doc.data().url)
    });

        await deleteObject(ref(storage,url[0]))
        await deleteDoc(doc(firestore,"images",table[0]))
    
}

export const updateAnyElementWithId = async (data,id,table) =>{
  const q = query(collection(firestore, table), where("id", "==", id));
  const tables = []
  const querySnapshot = await getDocs(q); 
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    tables.push(doc.id)
  
  });
  const ref = doc(firestore,table,tables[0])
  await updateDoc(ref,data).then(()=>{
 
  }).catch(
    (err)=>{
      console.log(err)
      alert(err)
    }
  )
  
}


export const deleteCategoryById = async (id,url) =>{
  const q = query(collection(firestore, "categories"), where("id", "==", id));
  const table = []
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    table.push(doc.id)
  });
  var answer = window.confirm("Voulez vous vraiment supprimer?");
  if (answer) {
      await deleteDoc(doc(firestore,"categories",table[0]))
      await deleteObject(ref(storage,url))
      alert("suppression terminée")
    
  }
  else {
  //some code
  }
}
export const deleteImageByUrl = async (url) =>{
}
export const setStatsCourriers = async () => {
  let offices = [] 
  let officescourriers = [] 
  await  getAllItems("offices","name","asc").then(
        (data) =>{
            offices = [...data]
        }
  )
  await getAllItems("officescourrier","bureau","desc").then(
    (data)=>{
        officescourriers = [...data]
    }
  )
  for(let i = 0;i<offices.length;i++)
  {
      let items = officescourriers.filter(o=>o.bureau === offices[i].name)
      let CV = []
      let CDD = []
      let CS = []
      let CRJT = []
      let CRVY = []
      let CEC = []
      let CEA = []
      CV = items.filter(d=>d.status === "Validé")
      CDD = items.filter(d=>d.status === "Délais dépassé")
      CS = items.filter(d=>d.status === "Suspendu")
      CRJT = items.filter(d=>d.status === "Rejeté")
      CRVY = items.filter(d=>d.status === "Renvoyé")
      CEC = items.filter(d=>d.status === "En cours")
      CEA = items.filter(d=>d.status === "En attente")

      updateAnyElementWithId({c:items.length,cv:CV.length,cdd:CDD.length,cs:CS.length,crjt:CRJT.length,crvy:CRVY.length,cec:CEC.length,cea:CEA.length},offices[i].id,"offices")   
  }        
}
export const sendExpireCourriers = async () => {
  let courriers = [] 
  let officescourriers = []
  let admins = [] 
  await  getAllItems("courriers","id","asc").then(
        (data) =>{
            courriers = [...data]
        }
  )
  await getAllItems("officescourrier","delais","asc").then(
    (data)=>{
        officescourriers = [...data]
    }
  )
  await getAllItems("community","name","desc").then(
    (data)=>{
        
        admins = [...data.filter(item=>item.status === "Administrateur")]
    }
  )
  
  for(let i = 0;i<officescourriers.length;i++)
  {
        
        
        let date = new Date().getTime()
        let courrier = courriers.filter(c=>c.id == officescourriers[i].idCourrier)[0]
        if(officescourriers[i].delais <= date && courrier.sent === false && officescourriers[i].status === "En cours")
        {
            await updateAnyElementWithId({
                status:"Délais dépassé"  
            },officescourriers[i].id,"officescourrier")
            await updateAnyElementWithId({
                sent:true,
                status:"Délais dépassé"      
            },courrier.id,"courriers")
            for(let i = 0;i<admins.length;i++)
            {
              await fetch(`${mailUrl}/email/sendEmail`,{
                method:"POST",
                body:JSON.stringify({
                  subject:`Hello ${admins[i].name}`,
                  email:admins[i].email,
                  message:"lorem ipsum"
                }),
                headers:{
                  Accept:"application/json",
                  "Content-Type":"application/json"
                }
              }).then(
                (res)=>{
                  if(res.status > 199 && res.status<3000)
                  {
                       
                  }
      
                }
              )      
            }
        } 
   }
   setStatsCourriers()
}