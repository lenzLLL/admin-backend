import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { MenuItem } from "@mui/material";
import {useStateValue} from "../context/StateProvider"

const CreateTeam = () => {
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
      <Header title="PERSONNEL" subtitle="Ajouter du personnel" />

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
                sx={{ gridColumn: "span 2" }}
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
                sx={{ gridColumn: "span 2" }}
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
                sx={{ gridColumn: "span 2" }}
              />
                                   <TextField
          id="standard-select-currency"
          select
          variant ="filled"
          label="Poste"
          value = {values.poste}
          onChange={handleChange}
          sx={{ gridColumn: "span 2" }}
        >
          {Postes.map((option) => (

               <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>

          ))}
        </TextField>
        <TextField
          id="bureau"
          select
          variant ="filled"
          label="Bureau"
          value = {values.bureau}
          onChange={handleChange}
          sx={{ gridColumn: "span 2" }}
        >
          {Bureaux.map((option) => (

               <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>

          ))}
        </TextField>
        <TextField
          id="privilege"
          select
          variant ="filled"
          label="Privilège"
          value = {values.privilege}
          onChange={handleChange}
          sx={{ gridColumn: "span 2" }}
        >
          {Privilèges.map((option) => (

               <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>

          ))}
        </TextField>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
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

export default CreateTeam;