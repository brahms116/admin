import { CircularProgress, Fade, Box, Button, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import { Ec2ControlState } from "./Ec2ControlState";

export const Ec2Control: React.FC = () => {
  const [state, setState] = useState(new Ec2ControlState({}));
  function handleButtonClick() {
    setState(state.loading());
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
