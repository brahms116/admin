import { Box, Button, TextField } from "@mui/material";

export const Login: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: 300, display: "flex", flexDirection: "column" }}>
        <TextField
          fullWidth
          label="Password"
          type="password"
          autoComplete="current-password"
        />
        <Box height={16}></Box>
        <Button variant="contained">LOGIN</Button>
      </Box>
    </Box>
  );
};
