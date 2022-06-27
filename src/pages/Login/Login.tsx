import { Box, Button, LinearProgress, TextField } from "@mui/material";
import { useEffect } from "react";
import { useLogin } from "./useLogin";

export const Login: React.FC = () => {
  const controller = useLogin();

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const text = e.target.value;
    controller.handlePwdChange(text);
  }

  useEffect(() => {
    controller.checkToken();
  }, []);

  function onButtonClick() {
    controller.signIn();
  }

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
          value={controller.pwdControl.getField()}
          onChange={handleInputChange}
          fullWidth
          label="Password"
          type="password"
          autoComplete="current-password"
          error={controller.pwdControl.getFieldErr().length > 0}
          helperText={controller.pwdControl.getFieldErr()}
        />
        <Box height={16}></Box>

        <Button
          variant="contained"
          onClick={onButtonClick}
          disabled={controller.isLoading}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {controller.isLoading ? "LOADING" : "LOGIN"}
          </Box>
        </Button>
        {controller.isLoading && <LinearProgress />}
      </Box>
    </Box>
  );
};
