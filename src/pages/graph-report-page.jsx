
import { useCallback, useEffect, useMemo, useState } from "react";

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
  Alert,
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
    let isMounted = true;

    const loadRecords = async () => {
      try {
        const [moodResponse, painResponse] = await Promise.all([
          fetchData("/moods"),
          fetchData("/pains"),
        ]);

        if (!isMounted) return;

        setMoods(Array.isArray(moodResponse?.data) ? moodResponse.data : []);
        setPains(Array.isArray(painResponse?.data) ? painResponse.data : []);
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to load graph data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRecords();

    return () => {
      isMounted = false;
    };
  }, []);

  // Generate the dates displayed on the graph.
  const dateLabels = useMemo(() => {
    const days = Number(timeRange);
    const today = new Date();

    return Array.from({ length: days }, (_, index) => {
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - (days - 1 - index)
      );

      return date;
    });
  }, [timeRange]);

  // Format dates using the user's local date.
  const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Calculate daily average ratings.
  const calculateDailyAverages = useCallback((records) => {
  const dailyTotals = {};

  records.forEach((record) => {
    const date = new Date(record.occurred_at);

    if (
      Number.isNaN(date.getTime()) ||
      !Number.isFinite(Number(record.value))
    ) {
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
    const dailyRecord = dailyTotals[getDateKey(date)];

    if (!dailyRecord) {
      return null;
    }

    return Number(
      (dailyRecord.total / dailyRecord.count).toFixed(1)
    );
  });
}, [dateLabels]);

  // Prepare graph data whenever records or timeframe change.
  const moodData = useMemo(
  () => calculateDailyAverages(moods),
  [moods, calculateDailyAverages]
);

const painData = useMemo(
  () => calculateDailyAverages(pains),
  [pains, calculateDailyAverages]
);

  const chartLabels = dateLabels.map((date) =>
    date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
    })
  );

  // Prepare the selected graph series.
  const chartSeries = [];

  if (selectedMood) {
    chartSeries.push({
      label: "Mood",
      data: moodData,
      color: "#8C52FF",
      showMark: true,
      connectNulls: false,
      valueFormatter: (value) =>
        value === null ? "No entry" : `${value}/10`,
    });
  }

  if (selectedPain) {
    chartSeries.push({
      label: "Pain",
      data: painData,
      color: "#7ED957",
      showMark: true,
      connectNulls: false,
      valueFormatter: (value) =>
        value === null ? "No entry" : `${value}/10`,
    });
  }

  // Check whether any selected series has records.
  const hasChartData = chartSeries.some((series) =>
    series.data.some((value) => value !== null)
  );

  // Count records within the selected timeframe.
  const recordCount = dateLabels.reduce((total, date) => {
    const dateKey = getDateKey(date);

    const moodCount = moods.filter(
      (record) =>
        getDateKey(new Date(record.occurred_at)) === dateKey
    ).length;

    const painCount = pains.filter(
      (record) =>
        getDateKey(new Date(record.occurred_at)) === dateKey
    ).length;

    return total + (selectedMood ? moodCount : 0) +
      (selectedPain ? painCount : 0);
  }, 0);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Grid container spacing={3}>
        {/* Graph Options */}
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
          <Paper sx={{ p: 3, minHeight: 500 }}>
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

            {!loading && !error && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {recordCount} {recordCount === 1 ? "record" : "records"} in
                the selected period.
              </Typography>
            )}

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
                <Alert severity="error" sx={{ width: "100%" }}>
                  {error}
                </Alert>
              ) : !selectedMood && !selectedPain ? (
                <Typography color="text.secondary">
                  Select Mood or Pain to display your graph.
                </Typography>
              ) : !hasChartData ? (
                <Typography color="text.secondary">
                  No mood or pain records found for this time period.
                </Typography>
              ) : (
                <Box sx={{ width: "100%" }}>
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
                        label: "Rating",
                      },
                    ]}
                    series={chartSeries}
                    margin={{
                      left: 55,
                      right: 30,
                      top: 30,
                      bottom: 45,
                    }}
                    grid={{
                      horizontal: true,
                    }}
                  />
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
