import { Typography, Box, useTheme,Button } from "@mui/material";
import { tokens } from "../theme";
import { Link } from "react-router-dom";

const Header = ({ title, subtitle,button,buttonLink }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <div style = {{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"30px"}}>
    <Box>
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      <Typography fontSize ="12px" variant="h5" color={colors.greenAccent[400]}>
        {subtitle}
      </Typography>
    </Box>
{  button &&  <Box display="flex" justifyContent="end" mt="20px">
              <Link to = {buttonLink} style = {{textDecoration:"none"}}>
              <Button type="submit" color="secondary" variant="contained">
                {button}
              </Button>
              </Link>
    </Box>}
  </div>
  );
};

export default Header;