
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";

import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import { fetchData } from "../services/api";

// Format a date as YYYY-MM-DD using local time.
const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Format dates for display.
const formatDisplayDate = (date) =>
  date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// Calculate daily averages.
const calculateDailyAverages = (records, dateLabels, selectedDateKeys) => {
  return dateLabels.map((date) => {
    const dateKey = getDateKey(date);

    if (!selectedDateKeys.includes(dateKey)) return null;

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

    if (dailyRecords.length === 0) return null;

    const total = dailyRecords.reduce(
      (sum, record) => sum + record.value,
      0
    );

    return Number((total / dailyRecords.length).toFixed(1));
  });
};

// Count rating frequencies from 1–10.
const calculateRatingFrequency = (records, selectedDateKeys) => {
  return Array.from({ length: 10 }, (_, index) => {
    const rating = index + 1;

    return records.filter((record) => {
      if (!record.occurred_at) return false;

      const recordDate = new Date(record.occurred_at);

      return (
        !Number.isNaN(recordDate.getTime()) &&
        selectedDateKeys.includes(getDateKey(recordDate)) &&
        record.value === rating
      );
    }).length;
  });
};

// Capture an element as a high-resolution canvas.
const captureElement = async (element) => {
  return html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
    windowWidth: element.scrollWidth,
  });
};

// Add a canvas to a PDF, creating extra pages if required.
const addCanvasToPDF = (pdf, canvas, addNewPage = false) => {
  const margin = 12;
  const pageWidth = 210;
  const pageHeight = 297;

  const imageWidth = pageWidth - margin * 2;
  const usablePageHeight = pageHeight - margin * 2;

  const pixelsPerMm = canvas.width / imageWidth;
  const sliceHeight = Math.floor(
    usablePageHeight * pixelsPerMm
  );

  const totalPages = Math.ceil(canvas.height / sliceHeight);

  for (let page = 0; page < totalPages; page += 1) {
    if (addNewPage || page > 0) {
      pdf.addPage();
    }

    const sourceY = page * sliceHeight;

    const currentSliceHeight = Math.min(
      sliceHeight,
      canvas.height - sourceY
    );

    const pageCanvas = document.createElement("canvas");

    pageCanvas.width = canvas.width;
    pageCanvas.height = currentSliceHeight;

    const context = pageCanvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(
      0,
      0,
      pageCanvas.width,
      pageCanvas.height
    );

    context.drawImage(
      canvas,
      0,
      sourceY,
      canvas.width,
      currentSliceHeight,
      0,
      0,
      canvas.width,
      currentSliceHeight
    );

    const imageData = pageCanvas.toDataURL("image/png");

    const imageHeight = currentSliceHeight / pixelsPerMm;

    pdf.addImage(
      imageData,
      "PNG",
      margin,
      margin,
      imageWidth,
      imageHeight
    );
  }
};

function GraphReportPage() {
  const [moods, setMoods] = useState([]);
  const [pains, setPains] = useState([]);
  const [events, setEvents] = useState([]);

  const [selectedMood, setSelectedMood] = useState(true);
  const [selectedPain, setSelectedPain] = useState(true);
  const [selectedEvents, setSelectedEvents] = useState(false);

  const [timeRange, setTimeRange] = useState("7");
  const [graphType, setGraphType] = useState("line");

  const [selectedEventDate, setSelectedEventDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [showPdfHeading, setShowPdfHeading] = useState(false);

  // Separate references allow Events to start on a new PDF page.
  const mainReportRef = useRef(null);
  const eventReportRef = useRef(null);

  // Fetch Mood, Pain and Event records.
  useEffect(() => {
    let isMounted = true;

    const loadGraphData = async () => {
      try {
        setLoading(true);
        setError("");

        const [moodResponse, painResponse, eventResponse] =
          await Promise.all([
            fetchData("/moods"),
            fetchData("/pains"),
            fetchData("/events"),
          ]);

        if (!isMounted) return;

        setMoods(moodResponse?.data || []);
        setPains(painResponse?.data || []);
        setEvents(eventResponse?.events || []);
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

    loadGraphData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Generate the dates for the selected time range.
  const dateLabels = useMemo(() => {
    const days = Number(timeRange);
    const dates = [];

    for (let i = days - 1; i >= 0; i -= 1) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);
      dates.push(date);
    }

    return dates;
  }, [timeRange]);

  const selectedDateKeys = useMemo(
    () => dateLabels.map((date) => getDateKey(date)),
    [dateLabels]
  );

  const chartLabels = useMemo(
    () =>
      dateLabels.map((date) =>
        date.toLocaleDateString("en-AU", {
          day: "numeric",
          month: "short",
        })
      ),
    [dateLabels]
  );

  // Daily Mood and Pain averages.
  const moodData = useMemo(
    () => calculateDailyAverages(moods, dateLabels, selectedDateKeys),
    [moods, dateLabels, selectedDateKeys]
  );

  const painData = useMemo(
    () => calculateDailyAverages(pains, dateLabels, selectedDateKeys),
    [pains, dateLabels, selectedDateKeys]
  );

  // Count Events recorded on each date.
  const eventCounts = useMemo(
    () =>
      dateLabels.map((date) => {
        const dateKey = getDateKey(date);

        return events.filter((event) => {
          if (!event.occurred_at) return false;

          const eventDate = new Date(event.occurred_at);

          return (
            !Number.isNaN(eventDate.getTime()) &&
            getDateKey(eventDate) === dateKey
          );
        }).length;
      }),
    [events, dateLabels]
  );

  // Mood and Pain line chart series.
  const dailySeries = useMemo(() => {
    const series = [];

    if (selectedMood) {
      series.push({
        id: "mood",
        label: "Mood",
        data: moodData,
        color: "#8C52FF",
        showMark: true,
        shape: "circle",
        labelMarkType: "circle",
        connectNulls: true,
        valueFormatter: (value) =>
          value === null ? "No entry" : `${value}/10`,
      });
    }

    if (selectedPain) {
      series.push({
        id: "pain",
        label: "Pain",
        data: painData,
        color: "#7ED957",
        showMark: true,
        shape: "square",
        labelMarkType: "square",
        connectNulls: true,
        valueFormatter: (value) =>
          value === null ? "No entry" : `${value}/10`,
      });
    }

    return series;
  }, [selectedMood, selectedPain, moodData, painData]);

  // Histogram data.
  const moodFrequencies = useMemo(
    () => calculateRatingFrequency(moods, selectedDateKeys),
    [moods, selectedDateKeys]
  );

  const painFrequencies = useMemo(
    () => calculateRatingFrequency(pains, selectedDateKeys),
    [pains, selectedDateKeys]
  );

  const histogramSeries = useMemo(() => {
    const series = [];

    if (selectedMood) {
      series.push({
        id: "mood",
        label: "Mood",
        data: moodFrequencies,
        color: "#8C52FF",
      });
    }

    if (selectedPain) {
      series.push({
        id: "pain",
        label: "Pain",
        data: painFrequencies,
        color: "#7ED957",
      });
    }

    return series;
  }, [
    selectedMood,
    selectedPain,
    moodFrequencies,
    painFrequencies,
  ]);

  // Check whether there is data to display.
  const hasMoodData = moodData.some((value) => value !== null);
  const hasPainData = painData.some((value) => value !== null);
  const hasEventData = eventCounts.some((count) => count > 0);

  const hasRatingData =
    (selectedMood && hasMoodData) || (selectedPain && hasPainData);

  const hasHistogramData = histogramSeries.some((series) =>
    series.data.some((value) => value > 0)
  );

  const hasChartData =
    graphType === "histogram"
      ? hasHistogramData
      : graphType === "line"
        ? hasRatingData || (selectedEvents && hasEventData)
        : hasRatingData;

  const noSelectedRatings = !selectedMood && !selectedPain;

  const showSelectionMessage =
    noSelectedRatings &&
    !(graphType === "line" && selectedEvents);

  // Count records in the selected time range.
  const moodRecordCount = moods.filter((record) => {
    if (!record.occurred_at) return false;

    const date = new Date(record.occurred_at);

    return (
      !Number.isNaN(date.getTime()) &&
      selectedDateKeys.includes(getDateKey(date))
    );
  }).length;

  const painRecordCount = pains.filter((record) => {
    if (!record.occurred_at) return false;

    const date = new Date(record.occurred_at);

    return (
      !Number.isNaN(date.getTime()) &&
      selectedDateKeys.includes(getDateKey(date))
    );
  }).length;

  const eventRecordCount = events.filter((event) => {
    if (!event.occurred_at) return false;

    const date = new Date(event.occurred_at);

    return (
      !Number.isNaN(date.getTime()) &&
      selectedDateKeys.includes(getDateKey(date))
    );
  }).length;

  // Find events for the selected date.
  const selectedEventsForDate = useMemo(() => {
    if (!selectedEventDate) return [];

    return events
      .filter((event) => {
        if (!event.occurred_at) return false;

        const date = new Date(event.occurred_at);

        return (
          !Number.isNaN(date.getTime()) &&
          getDateKey(date) === selectedEventDate
        );
      })
      .sort(
        (a, b) =>
          new Date(a.occurred_at) - new Date(b.occurred_at)
      );
  }, [events, selectedEventDate]);

  // Handle clicking an Events bar.
  const handleEventBarClick = (event, params) => {
    const clickedDate = dateLabels[params.dataIndex];

    if (clickedDate) {
      setSelectedEventDate(getDateKey(clickedDate));
    }
  };

  // Generate the PDF.
  const handleDownloadPDF = async () => {
    if (!mainReportRef.current) return;

    try {
      setPdfLoading(true);
      setPdfError("");

      // Temporarily display the PDF-only heading.
      setShowPdfHeading(true);

      // Wait for React and the charts to render.
      await new Promise((resolve) => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(resolve);
        });
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // First page: report heading, selected ratings and summary.
      const mainCanvas = await captureElement(mainReportRef.current);

      addCanvasToPDF(pdf, mainCanvas);

      // Events always begin on a new page.
      if (
        graphType === "line" &&
        selectedEvents &&
        eventReportRef.current
      ) {
        const eventCanvas = await captureElement(eventReportRef.current);

        addCanvasToPDF(pdf, eventCanvas, true);
      }

      const today = new Date().toISOString().slice(0, 10);

      pdf.save(`village-wellness-report-${today}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);

      setPdfError(
        "Unable to generate the PDF. Please try again."
      );
    } finally {
      setShowPdfHeading(false);
      setPdfLoading(false);
    }
  };

  const reportGeneratedDate = new Date().toLocaleDateString(
    "en-AU",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const reportStartDate = formatDisplayDate(dateLabels[0]);
  const reportEndDate = formatDisplayDate(
    dateLabels[dateLabels.length - 1]
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Grid container spacing={3}>
        {/* Graph options */}

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Graph Options
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={3}>
              {/* Graph type */}

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ textAlign: "left" }}>
                  Graph Type
                </Typography>

                <RadioGroup
                  value={graphType}
                  onChange={(event) => {
                    setGraphType(event.target.value);
                    setSelectedEventDate("");
                  }}
                >
                  <FormControlLabel
                    value="line"
                    control={<Radio />}
                    label="Line Chart"
                  />

                  <FormControlLabel
                    value="bar"
                    control={<Radio />}
                    label="Bar Chart"
                  />

                  <FormControlLabel
                    value="histogram"
                    control={<Radio />}
                    label="Histogram"
                  />
                </RadioGroup>
              </Box>

              <Divider />

              {/* Rating type */}

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ textAlign: "left" }}>
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

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedEvents}
                        disabled={graphType !== "line"}
                        onChange={(event) => {
                          setSelectedEvents(event.target.checked);
                          setSelectedEventDate("");
                        }}
                      />
                    }
                    label="Events"
                  />
                </FormGroup>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Events can be displayed with the Line Chart.
                </Typography>
              </Box>

              <Divider />

              {/* Time range */}

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ textAlign: "left" }}>
                  Time Range
                </Typography>

                <RadioGroup
                  value={timeRange}
                  onChange={(event) => {
                    setTimeRange(event.target.value);
                    setSelectedEventDate("");
                  }}
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

              <Divider />

              {/* Download PDF */}

              <Button
                variant="contained"
                fullWidth
                startIcon={
                  pdfLoading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <DownloadIcon />
                  )
                }
                onClick={handleDownloadPDF}
                disabled={loading || pdfLoading || Boolean(error)}
              >
                {pdfLoading ? "Generating PDF..." : "Download PDF"}
              </Button>

              {pdfError && (
                <Alert severity="error">
                  {pdfError}
                </Alert>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Main report and charts */}

        <Grid size={{ xs: 12, md: 9 }}>
          <Box
            ref={mainReportRef}
            sx={{
              backgroundColor: "#ffffff",
              color: "#263F60",
              p: 1,
              borderRadius: 1,
            }}
          >
            {/* This heading appears only during PDF generation. */}

            {showPdfHeading && (
              <Box sx={{ px: 2, py: 2 }}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ color: "#142B4A" }}
                >
                  The Village Wellness App
                </Typography>

                <Typography variant="h6" sx={{ mt: 0.5 }}>
                  Wellness Report
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Reporting period: {reportStartDate} – {reportEndDate}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Generated: {reportGeneratedDate}
                </Typography>

                <Divider sx={{ mt: 2 }} />
              </Box>
            )}

            <Paper
              elevation={2}
              sx={{
                p: 3,
                mb: 3,
                boxShadow: "none",
                border: "1px solid #E0E5EB",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Graphs & Reports
              </Typography>

              <Typography variant="body2" color="text.secondary">
                View your Mood, Pain and Event records over time.
              </Typography>

              <Divider sx={{ my: 2 }} />

              {loading && (
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

              {!loading && error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {!loading && !error && showSelectionMessage && (
                <Alert severity="info">
                  Please select Mood, Pain or Events to display a graph.
                </Alert>
              )}

              {!loading &&
                !error &&
                !showSelectionMessage &&
                !hasChartData && (
                  <Alert severity="info">
                    No records are available for the selected options and
                    time range.
                  </Alert>
                )}

              {!loading && !error && hasChartData && (
                <>
                  {/* Line chart: Mood and Pain only */}

                  {graphType === "line" && (
                    <>
                      {dailySeries.length > 0 && hasRatingData && (
                        <>
                          <Typography variant="h6">
                            Daily Mood and Pain
                          </Typography>

                          <LineChart
                            height={320}
                            xAxis={[
                              {
                                scaleType: "band",
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
                            series={dailySeries}
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

                      {selectedEvents && !hasRatingData && (
                        <Typography color="text.secondary">
                          Event records are shown in the Events section
                          below.
                        </Typography>
                      )}
                    </>
                  )}

                  {/* Daily average bar chart */}

                  {graphType === "bar" && hasRatingData && (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Daily Average Ratings
                      </Typography>

                      <BarChart
                        height={350}
                        xAxis={[
                          {
                            scaleType: "band",
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
                        series={dailySeries}
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

                  {/* Histogram */}

                  {graphType === "histogram" && hasHistogramData && (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Rating Frequency
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Shows how many times each rating was recorded.
                      </Typography>

                      <BarChart
                        height={350}
                        xAxis={[
                          {
                            scaleType: "band",
                            data: [
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                              "10",
                            ],
                            label: "Rating",
                          },
                        ]}
                        yAxis={[
                          {
                            min: 0,
                            label: "Number of entries",
                            valueFormatter: (value) => String(value),
                          },
                        ]}
                        series={histogramSeries}
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
                </>
              )}
            </Paper>

            {/* Records summary */}

            {!loading && !error && (
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  mb: 2,
                  boxShadow: "none",
                  border: "1px solid #E0E5EB",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Records Summary
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  {selectedMood && (
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Mood Entries
                      </Typography>

                      <Typography variant="h4" color="#8C52FF">
                        {moodRecordCount}
                      </Typography>
                    </Grid>
                  )}

                  {selectedPain && (
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Pain Entries
                      </Typography>

                      <Typography variant="h4" color="#7ED957">
                        {painRecordCount}
                      </Typography>
                    </Grid>
                  )}

                  {selectedEvents && graphType === "line" && (
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Events
                      </Typography>

                      <Typography variant="h4" color="#F4A261">
                        {eventRecordCount}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            )}
          </Box>

          {/* Events section - captured separately for PDF page 2 */}

          {!loading &&
            !error &&
            graphType === "line" &&
            selectedEvents && (
              <Box
                ref={eventReportRef}
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#263F60",
                  p: 1,
                  borderRadius: 1,
                  mt: 3,
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    boxShadow: "none",
                    border: "1px solid #E0E5EB",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Events
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Events recorded between {reportStartDate} and{" "}
                    {reportEndDate}.
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {hasEventData ? (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Events Recorded by Date
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Select an orange bar to view the events recorded
                        on that date.
                      </Typography>

                      <BarChart
                        height={220}
                        xAxis={[
                          {
                            scaleType: "band",
                            data: chartLabels,
                            label: "Date",
                          },
                        ]}
                        yAxis={[
                          {
                            min: 0,
                            max: Math.max(1, ...eventCounts),
                            label: "Number of events",
                            valueFormatter: (value) => String(value),
                          },
                        ]}
                        series={[
                          {
                            id: "events",
                            label: "Events",
                            data: eventCounts,
                            color: "#F4A261",
                            valueFormatter: (value) =>
                              `${value} ${
                                value === 1 ? "event" : "events"
                              }`,
                          },
                        ]}
                        onItemClick={handleEventBarClick}
                        margin={{
                          left: 65,
                          right: 30,
                          top: 20,
                          bottom: 45,
                        }}
                        grid={{ horizontal: true }}
                      />

                      <Divider sx={{ my: 3 }} />

                      <Typography variant="h6" gutterBottom>
                        Event Details
                      </Typography>

                      {!selectedEventDate && (
                        <Typography color="text.secondary">
                          Select an Events bar above to view the details
                          for that date.
                        </Typography>
                      )}

                      {selectedEventDate && (
                        <>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ mb: 2 }}
                          >
                            {formatDisplayDate(
                              new Date(`${selectedEventDate}T00:00:00`)
                            )}
                          </Typography>

                          {selectedEventsForDate.length === 0 ? (
                            <Typography color="text.secondary">
                              No events found for this date.
                            </Typography>
                          ) : (
                            <Stack spacing={2}>
                              {selectedEventsForDate.map((event) => (
                                <Paper
                                  key={event._id}
                                  variant="outlined"
                                  sx={{ p: 2 }}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                  >
                                    {event.title}
                                  </Typography>

                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                  >
                                    {event.category
                                      ?.replace("_", " ")
                                      .replace(/\b\w/g, (letter) =>
                                        letter.toUpperCase()
                                      )}
                                    {" · "}
                                    {new Date(
                                      event.occurred_at
                                    ).toLocaleTimeString("en-AU", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </Typography>

                                  {event.description && (
                                    <Typography variant="body2">
                                      {event.description}
                                    </Typography>
                                  )}
                                </Paper>
                              ))}
                            </Stack>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <Alert severity="info">
                      No events have been recorded during this time range.
                    </Alert>
                  )}
                </Paper>
              </Box>
            )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default GraphReportPage;
