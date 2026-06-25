import {
  Grid,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
  Divider,
  Stack,
} from "@mui/material";

export default function GraphPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={3}>
        {/* Left Sidebar */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Graph Options
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack spacing={4}>
              {/* Graph Type */}
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Graph Type
                </Typography>

                <FormGroup
                  sx={{
                    alignItems: "flex-start",
                  }}
                >
                  <FormControlLabel control={<Checkbox />} label="Line Graph" />
                  <FormControlLabel control={<Checkbox />} label="Histogram" />
                  <FormControlLabel control={<Checkbox />} label="Box Plot" />
                </FormGroup>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {/* Rating Type */}
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Rating Type
                </Typography>

                <FormGroup
                  sx={{
                    alignItems: "flex-start",
                  }}
                >
                  <FormControlLabel control={<Checkbox />} label="Mood" />
                  <FormControlLabel control={<Checkbox />} label="Pain" />
                  <FormControlLabel control={<Checkbox />} label="Events" />
                </FormGroup>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {/* Time Range */}
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Time Range
                </Typography>

                <FormGroup
                  sx={{
                    alignItems: "flex-start",
                  }}
                >
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Last 7 Days"
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Last 14 Days"
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Last 21 Days"
                  />
                </FormGroup>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Main Graph */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Paper
            sx={{
              p: 3,
              minHeight: 500,
            }}
          >
            <Typography variant="h5">Graphs & Reports</Typography>

            <Box
              sx={{
                mt: 3,
                height: 350,
                border: "1px dashed grey",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Graph goes here
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
