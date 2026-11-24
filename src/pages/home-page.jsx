
import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import MoodIcon from "@mui/icons-material/Mood";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EventIcon from "@mui/icons-material/Event";
import SpaIcon from "@mui/icons-material/Spa";

import { useNavigate } from "react-router-dom";
import { LineChart } from "@mui/x-charts/LineChart";

import { fetchData } from "../services/api";

// Dummy data shown to visitors who are not logged in.
const graphData = [
  { day: "Mon", mood: 4, pain: 2 },
  { day: "Tue", mood: 3, pain: 4 },
  { day: "Wed", mood: 5, pain: 1 },
  { day: "Thu", mood: 4, pain: 2 },
  { day: "Fri", mood: 2, pain: 5 },
  { day: "Sat", mood: 3, pain: 3 },
  { day: "Sun", mood: 4, pain: 2 },
];

// Daily wellness tips.
const wellnessTips = [
  "Even a five-minute walk can improve mood and reduce stress. Take a moment to step outside today.",
  "Remember to drink water throughout the day. Staying hydrated supports concentration and energy.",
  "Take a few slow, deep breaths. A short breathing break can help you feel calmer.",
  "You don't have to accomplish everything today. Focus on one small thing at a time.",
  "Getting enough sleep is an important part of looking after your physical and emotional wellbeing.",
  "Take a moment to notice something you are grateful for today.",
  "Gentle movement can help relieve tension. Try stretching or taking a short walk.",
  "It's okay to take a break. Rest is productive too.",
  "Check in with yourself today. How are you feeling, and what do you need?",
  "Spending time outdoors can be a simple way to support your wellbeing.",
  "Stay connected. A quick message or conversation with someone you care about can make a difference.",
  "Celebrate small achievements. Progress doesn't have to be big to be meaningful.",
  "Try to make time for an activity you genuinely enjoy today.",
  "Be kind to yourself. You deserve the same patience and understanding you give others.",
  "Try to step away from screens for a few minutes and give your mind a rest.",
  "Set a small, achievable goal for today. Every step forward counts.",
  "Listen to your body. If you need rest, give yourself permission to slow down.",
  "A little preparation can make tomorrow feel less overwhelming.",
  "Make time for something that makes you smile today.",
  "Remember that asking for support is a sign of strength, not weakness.",
  "Try a mindful moment today. Notice what you can see, hear and feel around you.",
];

// Format dates using local time.
const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Calculate daily averages for Mood and Pain records.
const calculateDailyAverages = (records, dates) => {
  return dates.map((date) => {
    const dateKey = getDateKey(date);

    const dailyRecords = records.filter((record) => {
      if (!record.occurred_at) return false;

      const recordDate = new Date(record.occurred_at);

      return (
        !Number.isNaN(recordDate.getTime()) &&
        getDateKey(recordDate) === dateKey &&
        typeof record.value === "number" &&
        record.value >= 1 &&
        record.value <= 10
      );
    });

    if (dailyRecords.length === 0) {
      return null;
    }

    const total = dailyRecords.reduce(
      (sum, record) => sum + record.value,
      0
    );

    return Number((total / dailyRecords.length).toFixed(1));
  });
};

export default function HomePage() {
  const navigate = useNavigate();

  // Check whether the user has an authentication token.
  const authToken = localStorage.getItem("authToken");
  const isLoggedIn = Boolean(authToken);

  const [moods, setMoods] = useState([]);
  const [pains, setPains] = useState([]);
  const [loading, setLoading] = useState(isLoggedIn);
  const [error, setError] = useState("");

  // Select a wellness tip based on the current calendar day.
  const today = new Date();

  const dayNumber = Math.floor(
    (
      Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      ) -
      Date.UTC(today.getFullYear(), 0, 0)
    ) / 86400000
  );

  const dailyWellnessTip =
    wellnessTips[dayNumber % wellnessTips.length];

  // Fetch live Mood and Pain data only when logged in.
  useEffect(() => {
    let isMounted = true;

    if (!authToken) {
      return () => {
        isMounted = false;
      };
    }

    const loadGraphData = async () => {
      try {
        const [moodResponse, painResponse] = await Promise.all([
          fetchData("/moods"),
          fetchData("/pains"),
        ]);

        if (!isMounted) return;

        setMoods(moodResponse?.data || []);
        setPains(painResponse?.data || []);
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || "Unable to load your Mood and Pain data."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadGraphData();

    return () => {
      isMounted = false;
    };
  }, [authToken]);

  // Generate the last seven dates.
  const dateLabels = useMemo(() => {
    const dates = [];

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);
      dates.push(date);
    }

    return dates;
  }, []);

  // Display labels for the graph.
  const chartLabels = useMemo(
    () =>
      dateLabels.map((date) =>
        date.toLocaleDateString("en-AU", {
          weekday: "short",
          day: "numeric",
        })
      ),
    [dateLabels]
  );

  // Calculate live Mood and Pain averages.
  const liveMoodData = useMemo(
    () => calculateDailyAverages(moods, dateLabels),
    [moods, dateLabels]
  );

  const livePainData = useMemo(
    () => calculateDailyAverages(pains, dateLabels),
    [pains, dateLabels]
  );

  const hasLiveData =
    liveMoodData.some((value) => value !== null) ||
    livePainData.some((value) => value !== null);

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
              <Stack spacing={2} sx={{ alignItems: "center" }}>
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
              <Stack spacing={2} sx={{ alignItems: "center" }}>
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
              <Stack spacing={2} sx={{ alignItems: "center" }}>
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

      {/* Mood and Pain Graph */}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Mood & Pain Trends
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {isLoggedIn
            ? "Your daily Mood and Pain averages over the last seven days."
            : "Example Mood and Pain trends over seven days."}
        </Typography>

        <Box sx={{ mt: 3 }}>
          {/* Logged-in user: show live data */}

          {isLoggedIn && loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 6,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {isLoggedIn && !loading && error && (
            <Alert severity="error">{error}</Alert>
          )}

          {isLoggedIn && !loading && !error && (
            <>
              {!hasLiveData && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  You haven't recorded any Mood or Pain entries in the last
                  seven days. Your graph will appear here once you start
                  recording entries.
                </Alert>
              )}

              <LineChart
                height={350}
                xAxis={[
                  {
                    scaleType: "point",
                    data: chartLabels,
                    label: "Date",
                  },
                ]}
                yAxis={[
                  {
                    min: 1,
                    max: 10,
                    label: "Rating (1–10)",
                  },
                ]}
                series={[
                  {
                    id: "mood",
                    label: "Mood",
                    data: liveMoodData,
                    color: "#8C52FF",
                    showMark: true,
                    shape: "circle",
                    connectNulls: true,
                    valueFormatter: (value) =>
                      value === null ? "No entry" : `${value}/10`,
                  },
                  {
                    id: "pain",
                    label: "Pain",
                    data: livePainData,
                    color: "#7ED957",
                    showMark: true,
                    shape: "square",
                    connectNulls: true,
                    valueFormatter: (value) =>
                      value === null ? "No entry" : `${value}/10`,
                  },
                ]}
                margin={{
                  left: 65,
                  right: 30,
                  top: 25,
                  bottom: 45,
                }}
                grid={{ horizontal: true }}
              />
            </>
          )}

          {/* Visitors: show dummy placeholder data */}

          {!isLoggedIn && (
            <LineChart
              height={350}
              xAxis={[
                {
                  scaleType: "point",
                  data: graphData.map((item) => item.day),
                  label: "Day",
                },
              ]}
              yAxis={[
                {
                  min: 1,
                  max: 10,
                  label: "Rating (1–10)",
                },
              ]}
              series={[
                {
                  id: "mood",
                  label: "Mood",
                  data: graphData.map((item) => item.mood),
                  color: "#8C52FF",
                  showMark: true,
                  shape: "circle",
                },
                {
                  id: "pain",
                  label: "Pain",
                  data: graphData.map((item) => item.pain),
                  color: "#7ED957",
                  showMark: true,
                  shape: "square",
                },
              ]}
              margin={{
                left: 65,
                right: 30,
                top: 25,
                bottom: 45,
              }}
              grid={{ horizontal: true }}
            />
          )}
        </Box>
      </Paper>

      {/* Daily Wellness Tip */}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              sx={{ alignItems: "center" }}
            >
              <SpaIcon color="success" sx={{ fontSize: 55 }} />

              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" gutterBottom>
                  Daily Wellness Tip
                </Typography>

                <Typography color="text.secondary">
                  {dailyWellnessTip}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
