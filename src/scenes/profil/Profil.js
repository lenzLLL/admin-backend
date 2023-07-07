import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { MenuItem } from "@mui/material";
import { display } from "@mui/system";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import { Person } from "@mui/icons-material";
import CallIcon from '@mui/icons-material/Call';
import MailIcon from '@mui/icons-material/Mail';
import ApartmentIcon from '@mui/icons-material/Apartment';
import RadarIcon from '@mui/icons-material/Radar';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Profil = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log(values);
  };
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
  return (
     
    <Box m="20px">
      <Header title="MON PROFIL" subtitle="Modifier votre profil" />
     <div style = {{padding:"20px 100px",display:"flex",justifyContent:"space-between",gap:"20px"}}>
      <div >
          <div style = {{display:"flex",flex:1,gap:"10px",alignItems:"center"}}>
                <div>
                    <img style = {{height:"100px",width:"100px",borderRadius:"50%"}}  src={`https://images.unsplash.com/photo-1533939141733-63078e139c4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHVzZXIlMjBwcm9maWxlJTIwYmxhY2t8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60`}/>
                </div>
                <div>
                    <h3 style = {{margin:"0"}}>Younda nandjou lenz</h3>
                    <h5 style = {{margin:"0"}}>Sécrétaire d'Etat</h5>
                </div>
              
          </div>
          <h3>Informations</h3>
          <div style = {{display:"flex",flexDirection:"column",alignItems:"flex-start"}}>
             <p style = {{display:"flex",alignItems:"center",gap:"10px",fontSize:"15px",fontWeight:"700",margin:"3px 0"}}><Person/> Younda Nandjou lenz</p>
             <p style = {{display:"flex",alignItems:"center",gap:"10px",fontSize:"15px",fontWeight:"700",margin:"3px 0"}}><CallIcon/> 671434007</p>
             <p style = {{display:"flex",alignItems:"center",gap:"10px",fontSize:"15px",fontWeight:"700",margin:"3px 0"}}><MailIcon/>lenzyounda@gmail.com</p>
             <p style = {{display:"flex",alignItems:"center",gap:"10px",fontSize:"15px",fontWeight:"700",margin:"3px 0"}}><ApartmentIcon/>lf3eze</p>
             <p style = {{display:"flex",alignItems:"center",gap:"10px",fontSize:"15px",fontWeight:"700",margin:"3px 0"}}><RadarIcon/>Sécrétaire Général</p>
             <p style = {{display:"flex",alignItems:"center",gap:"10px",fontSize:"15px",fontWeight:"700",margin:"3px 0"}}><AdminPanelSettingsIcon/>Administrateur</p>




          </div>

          
      </div>   
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
                fullWidth
                variant="filled"
                type="text"
                label="Contact"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                name="name"
                error={!!touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
                sx={{ gridColumn: "span 4" }}
              />
                            <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
                                
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Enregistrer
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      </div>  
    </Box>
 
  );
};


const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  poste: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  status: yup.string().required("required"),
  phone: yup.string().required("required"),
  privilege: yup.string().required("required"),
  ct:yup.number().required("required"),
  bureau: yup.string().required("required"),
});
const initialValues = {
  name: "",
  poste: "",
  status: "",
  phone: "",
  ct: 12,
  email: "",
  privilege:"",
  bureau:""
};

export default Profil;