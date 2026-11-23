
import { useEffect, useState } from "react";

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
  Radio,
  RadioGroup,
  CircularProgress,
} from "@mui/material";

import { LineChart } from "@mui/x-charts/LineChart";

import { fetchData } from "../services/api";

export default function GraphPage() {
  const [moods, setMoods] = useState([]);
  const [pains, setPains] = useState([]);

  const [selectedMood, setSelectedMood] = useState(true);
  const [selectedPain, setSelectedPain] = useState(true);
  const [timeRange, setTimeRange] = useState("7");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Retrieve the user's mood and pain records.
  useEffect(() => {
    const loadRecords = async () => {
      try {
        setLoading(true);
        setError("");

        const [moodResponse, painResponse] = await Promise.all([
          fetchData("/moods"),
          fetchData("/pains"),
        ]);

        setMoods(moodResponse?.data || []);
        setPains(painResponse?.data || []);
      } catch (err) {
        setError(err.message || "Unable to load graph data.");
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, []);

  // Create the dates displayed on the graph.
  const days = Number(timeRange);
  const today = new Date();

  const dateLabels = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - i
    );

    dateLabels.push(date);
  }

  // Format dates consistently using the user's local date.
  const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Calculate the average rating for each day.
  const calculateDailyAverages = (records) => {
    const dailyTotals = {};

    records.forEach((record) => {
      const date = new Date(record.occurred_at);

      if (Number.isNaN(date.getTime())) {
        return;
      }

      const dateKey = getDateKey(date);

      if (!dailyTotals[dateKey]) {
        dailyTotals[dateKey] = {
          total: 0,
          count: 0,
        };
      }

      dailyTotals[dateKey].total += Number(record.value);
      dailyTotals[dateKey].count += 1;
    });

    return dateLabels.map((date) => {
      const dateKey = getDateKey(date);
      const dailyRecord = dailyTotals[dateKey];

      if (!dailyRecord) {
        return null;
      }

      return Number(
        (dailyRecord.total / dailyRecord.count).toFixed(1)
      );
    });
  };

  const moodData = calculateDailyAverages(moods);
  const painData = calculateDailyAverages(pains);

  const chartLabels = dateLabels.map((date) =>
    date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
    })
  );

  // Only display the selected rating types.
  const chartSeries = [];

  if (selectedMood) {
    chartSeries.push({
      label: "Mood",
      data: moodData,
      color: "#8C52FF",
      connectNulls: false,
    });
  }

  if (selectedPain) {
    chartSeries.push({
      label: "Pain",
      data: painData,
      color: "#7ED957",
      connectNulls: false,
    });
  }

  const hasChartData = chartSeries.some((series) =>
    series.data.some((value) => value !== null)
  );

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

            <Stack spacing={3}>
              {/* Graph Type */}
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Graph Type
                </Typography>

                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked disabled />}
                    label="Line Graph"
                  />
                </FormGroup>

                <Typography variant="caption" color="text.secondary">
                  Additional graph types may be added later.
                </Typography>
              </Box>

              <Divider />

              {/* Rating Type */}
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Rating Type
                </Typography>

                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedMood}
                        onChange={(event) =>
                          setSelectedMood(event.target.checked)
                        }
                      />
                    }
                    label="Mood"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedPain}
                        onChange={(event) =>
                          setSelectedPain(event.target.checked)
                        }
                      />
                    }
                    label="Pain"
                  />
                </FormGroup>
              </Box>

              <Divider />

              {/* Time Range */}
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Time Range
                </Typography>

                <RadioGroup
                  value={timeRange}
                  onChange={(event) => setTimeRange(event.target.value)}
                >
                  <FormControlLabel
                    value="7"
                    control={<Radio />}
                    label="Last 7 Days"
                  />

                  <FormControlLabel
                    value="14"
                    control={<Radio />}
                    label="Last 14 Days"
                  />

                  <FormControlLabel
                    value="21"
                    control={<Radio />}
                    label="Last 21 Days"
                  />
                </RadioGroup>
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
            <Typography variant="h5">
              Graphs & Reports
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Daily average mood and pain ratings over the selected period.
            </Typography>

            <Box
              sx={{
                mt: 3,
                minHeight: 350,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {loading ? (
                <Stack alignItems="center" spacing={2}>
                  <CircularProgress />
                  <Typography color="text.secondary">
                    Loading your records...
                  </Typography>
                </Stack>
              ) : error ? (
                <Typography color="error">
                  {error}
                </Typography>
              ) : !selectedMood && !selectedPain ? (
                <Typography color="text.secondary">
                  Select Mood or Pain to display your graph.
                </Typography>
              ) : !hasChartData ? (
                <Typography color="text.secondary">
                  No mood or pain records found for this time period.
                </Typography>
              ) : (
                <LineChart
                  height={350}
                  xAxis={[
                    {
                      scaleType: "point",
                      data: chartLabels,
                    },
                  ]}
                  yAxis={[
                    {
                      min: 1,
                      max: 10,
                    },
                  ]}
                  series={chartSeries}
                  margin={{
                    left: 50,
                    right: 30,
                    top: 30,
                    bottom: 40,
                  }}
                  grid={{
                    horizontal: true,
                  }}
                />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
