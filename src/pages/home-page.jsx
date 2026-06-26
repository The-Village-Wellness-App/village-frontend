import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
} from "@mui/material";

import MoodIcon from "@mui/icons-material/Mood";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EventIcon from "@mui/icons-material/Event";
import SpaIcon from "@mui/icons-material/Spa";
import { useNavigate } from "react-router-dom";
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

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      {/* Welcome */}

      <Typography variant="h3" gutterBottom>
        Hello!
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
        How are you feeling today?
      </Typography>

      {/* Quick Actions */}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack spacing={2} alignItems="center">
                <MoodIcon color="secondary" sx={{ fontSize: 60 }} />

                <Typography variant="h6">Log Mood</Typography>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate("/mood")}
                >
                  Log Mood
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack spacing={2} alignItems="center">
                <FavoriteIcon color="error" sx={{ fontSize: 60 }} />

                <Typography variant="h6">Log Pain</Typography>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate("/pain")}
                >
                  Log Pain
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack spacing={2} alignItems="center">
                <EventIcon color="primary" sx={{ fontSize: 60 }} />

                <Typography variant="h6">Log Event</Typography>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate("/event")}
                >
                  Log Event
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Graph */}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Mood & Pain Trends
        </Typography>

        <Box sx={{ mt: 3 }}>
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

      {/* Bottom Section */}

      <Grid size={{ xs: 12, md: 5 }}>
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <SpaIcon color="success" sx={{ fontSize: 50 }} />

            <Typography variant="h5">Wellness Tip</Typography>

            <Typography>
              Even a five-minute walk can improve mood and reduce stress. Take a
              moment to step outside today.
            </Typography>
          </Stack>
        </Paper>
      </Grid>
    </Box>
  );
}
