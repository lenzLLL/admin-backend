import React,{useState,useEffect} from "react"
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { MenuItem } from "@mui/material";
import {doc,getDocs,Timestamp, orderBy,setDoc,collection,query} from "firebase/firestore"
import {firestore} from "../../firebase.config"
const AddOffice = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [isLoading,setIsLoading] = useState(false)
  const [executed,setExecuted] = useState(false)
  const saveDetails = async (description,name,c,cv,cdd,cs,crjt,crvy,cec,cea) =>{
    try{

                const data = {
                    id: Date.now(),
                    description,
                    name,
                    c,
                    cv,
                    cdd,
                    cs,
                    crjt,
                    crvy,
                    cec
                }
                try{
                    // for(let i = 0;i<images.length;i++)
                    // {
                    //     await setDoc(doc(firestore,"images",`${Date.now()}`),images[i],{merge:true})
                    // }
                    setIsLoading(true)
                    await setDoc(doc(firestore,"offices",`${Date.now()}`),data,{merge:true}).then(
                      ()=>{
                        alert("bureau ajouté")
                        window.location.reload()
                      }
                    ).catch(
                      ()=>{
                        isLoading(false)
                      }
                    )
                  
                }
                catch(error)
                {
                    alert(error)
                    setIsLoading(false)
                }
    }
    catch(error)
    {
    alert("Error")
    }
}  
  const handleFormSubmit = (values) => {
    saveDetails(values.description,values.name,values.c,values.cv,values.cdd,values.cs,values.crjt,values.crvy,values.cec,values.cea)
  };
const Users = [
    {
        name:"Younda"
    },
    {
        name:"Younda"
    },
    {
        name:"Younda"
    },
    {
        name:"Younda"
    },
    {
        name:"Younda"
    }
]
  return (
    <Box m="20px">
      <Header title="CREER BUREAU" subtitle="Créer un nouveau bureau" />

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
                label="Nom"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />

        <TextField
          id="outlined-multiline-flexible"
          label="Description"
          multiline
          variant = "filled"
          minRows={4}
          value={values.description}

          name ="description"
          onChange={handleChange}
          sx={{ gridColumn: "span 4" }}
        />
             
            
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button disabled = {isLoading} type="submit" color="secondary" variant="contained">
                Enregistrer
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};


const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
});
const initialValues = {
  name: "",
  description: "",
  c: 0,
  cv: 0,
  cdd: 0,
  cec:0,
  crjt:0,
  crvy:0,
  cs:0,
  cea:0
};

export default AddOffice;