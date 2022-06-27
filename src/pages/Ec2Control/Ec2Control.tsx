import { CircularProgress, Fade, Box, Button, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useEffect } from "react";
import { Ec2Status } from "../../lib";
import { useEc2Ctrl } from "./useEc2Ctrl";

export const Ec2Control: React.FC = () => {
  const controller = useEc2Ctrl();

  useEffect(() => {
    if (controller.isToken) {
      controller.ec2Status();
    } else {
      controller.onReload();
    }
  }, [controller.isToken]);

  const state = controller.ec2State;
  const status = state.ec2Status;
  function handleButtonClick() {
    if (status === Ec2Status.On) {
      controller.ec2Off();
    } else if (status === Ec2Status.Off) {
      controller.ec2On();
    }
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
          {state.isLoading && (
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
          {!state.isLoading && (
            <Fade in>
              <Box>
                <Typography variant="subtitle1" color={grey[400]}>
                  Status:
                </Typography>
                <Box sx={{ height: 4 }}></Box>
                <Typography variant="h5">{state.statusText}</Typography>
                {state.publicIP
                  .map((e) => (
                    <>
                      <Box sx={{ height: 4 }}></Box>
                      <Typography variant="caption" color={grey[800]}>
                        {e}
                      </Typography>
                    </>
                  ))
                  .unwrapOr(<></>)}
              </Box>
            </Fade>
          )}
        </Box>
        <Box sx={{ height: 24 }}></Box>
        <Button
          onClick={handleButtonClick}
          fullWidth
          disabled={state.buttonDisabled}
          variant="outlined"
          color={state.buttonColor as any}
        >
          {state.buttonText}
        </Button>
      </Box>
    </Box>
  );
};
