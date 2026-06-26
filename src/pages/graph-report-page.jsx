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

import { LineChart } from "@mui/x-charts/LineChart";

{
  /* Dummy Data - Placeholder */
}
const graphData = [
  { day: "Mon", mood: 4, pain: 2 },
  { day: "Tue", mood: 3, pain: 4 },
  { day: "Wed", mood: 5, pain: 1 },
  { day: "Thu", mood: 4, pain: 2 },
  { day: "Fri", mood: 2, pain: 5 },
  { day: "Sat", mood: 3, pain: 3 },
  { day: "Sun", mood: 4, pain: 2 },
];

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

            {/* Placeholder for graphs/reports */}

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
              <LineChart
                height={350}
                xAxis={[
                  {
                    scaleType: "point",
                    data: graphData.map((item) => item.day),
                  },
                ]}
                series={[
                  {
                    label: "Mood",
                    data: graphData.map((item) => item.mood),
                    color: "#8C52FF",
                  },
                  {
                    label: "Pain",
                    data: graphData.map((item) => item.pain),
                    color: "#7ED957",
                  },
                ]}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
