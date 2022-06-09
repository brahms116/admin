import { CircularProgress, Fade, Box, Button, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import { useAuthGuard } from "../../lib/Auth";
import { Ec2ControlState } from "./Ec2ControlState";

export const Ec2Control: React.FC = () => {
  useAuthGuard();

  const [loading, setLoading] = useState(false);

  const [state, setState] = useState(
    new Ec2ControlState({
      isLoading: false,
      buttonText: "Start Instance",
      buttonColor: "success",
      buttonDisabled: false,
      statusText: "pending",
    })
  );

  function handleButtonClick() {
    setLoading(true);
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
      <Box sx={{ width: 300 }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: 100,
          }}
        >
          {loading && (
            <Fade in>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            </Fade>
          )}
          {!loading && (
            <Fade in>
              <Box>
                <Typography variant="subtitle1" color={grey[400]}>
                  Status:
                </Typography>
                <Box sx={{ height: 4 }}></Box>
                <Typography variant="h5">Stopped</Typography>
                <Box sx={{ height: 4 }}></Box>
                <Typography variant="caption" color={grey[800]}>
                  Public Ip: 13.245.53.45
                </Typography>
              </Box>
            </Fade>
          )}
        </Box>
        <Box sx={{ height: 24 }}></Box>
        <Button
          onClick={handleButtonClick}
          fullWidth
          variant="outlined"
          color="success"
        >
          Start Instance
        </Button>
      </Box>
    </Box>
  );
};
