import React,{useState,useEffect} from "react"
import { useNavigate } from "react-router-dom";
import { firestore } from "../../firebase.config";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { MenuItem } from "@mui/material";
import {doc,getDocs,Timestamp, orderBy,setDoc,collection,query} from "firebase/firestore"



const CreateFolder = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const history = useNavigate()
  const [isLoading,setIsLoading] = useState(false)
  const saveDetails = async (name) =>{
    try{
          
                const data = {
                    id: Date.now(),
                    name
                }
                try{
                    // for(let i = 0;i<images.length;i++)
                    // {
                    //     await setDoc(doc(firestore,"images",`${Date.now()}`),images[i],{merge:true})
                    // }
                    setIsLoading(true)
                    await setDoc(doc(firestore,"folders",`${Date.now()}`),data,{merge:true}).then(
                      ()=>{
                        alert("dossier ajouté")
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
  const handleFormSubmit = (values) => {
    saveDetails(values.name)
  };



  return (
    <Box m="20px">
      <Header title="Dossier" subtitle="Ajouter un nouveau type de courrier" />

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
                label="Nom complet"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
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
};

export default CreateFolder;