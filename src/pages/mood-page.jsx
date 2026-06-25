import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Slider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { fetchData, createMood, updateMood, deleteMood } from "../services/api";

function Mood() {
  const [Moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    value: 0,
    optional_text: "",
    occurred_at: dayjs(),
  });

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    value: 0,
    optional_text: "",
    occurred_at: dayjs(),
  });
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [moodToDelete, setMoodToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMoods = async () => {
    try {
      setLoading(true);
      const data = await fetchData("/moods");
      setMoods(data?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // grab the current mood list when the page opens
    loadMoods();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSliderChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // keep the form simple and make sure the value is in range

    const parsedValue = Number(formData.value);

    if (formData.value === "" || Number.isNaN(parsedValue)) {
      setSubmitError("mood value is required");
      return;
    }

    if (parsedValue < 0 || parsedValue > 10) {
      setSubmitError("mood value must be between 0 and 10");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createMood({
        value: parsedValue,
        optional_text: formData.optional_text.trim() || "",
        occurred_at: formData.occurred_at.toISOString(),
      });

      // put the newest mood entry at the top so it feels live
      setMoods((prev) => [response?.data || response, ...prev]);
      setFormData({
        value: 0,
        optional_text: "",
        occurred_at: dayjs(),
      });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStart = (mood) => {
    setEditingId(mood._id);
    setEditFormData({
      value: Number(mood.value ?? 0),
      optional_text: mood.optional_text || "",
      occurred_at: dayjs(mood.occurred_at),
    });
    setEditError(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditFormData({
      value: 0,
      optional_text: "",
      occurred_at: dayjs(),
    });
    setEditError(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSliderChange = (name, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError(null);

    const parsedValue = Number(editFormData.value);

    if (editFormData.value === "" || Number.isNaN(parsedValue)) {
      setEditError("Mood value is required");
      return;
    }

    if (parsedValue < 0 || parsedValue > 10) {
      setEditError("Mood value must be between 0 and 10");
      return;
    }

    try {
      setIsEditSubmitting(true);
      const response = await updateMood(editingId, {
        value: parsedValue,
        optional_text: editFormData.optional_text.trim() || "",
        occurred_at: editFormData.occurred_at.toISOString(),
      });

      // swap in the updated entry without reloading the whole page
      setMoods((prev) =>
        prev.map((mood) =>
          mood._id === editingId ? response?.data || response : mood,
        ),
      );
      handleEditCancel();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleDeleteStart = (mood) => {
    setMoodToDelete(mood);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await deleteMood(moodToDelete._id);
      // remove it from the list right away after the delete goes through
      setMoods((prev) => prev.filter((mood) => mood._id !== moodToDelete._id));
      setDeleteConfirmOpen(false);
      setMoodToDelete(null);
    } catch (err) {
      setDeleteConfirmOpen(false);
      setMoodToDelete(null);
      setError("Failed to delete mood entry: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setMoodToDelete(null);
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ mb: 4, fontWeight: "bold" }}
      >
        Mood Tracking
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
            Add Mood Entry
          </Typography>

          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Box>
                <Typography gutterBottom>
                  Mood Value: {formData.value}/10
                </Typography>
                <Slider
                  value={Number(formData.value)}
                  onChange={(_, newValue) =>
                    handleSliderChange("value", newValue)
                  }
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={0}
                  max={10}
                />
              </Box>

              <TextField
                fullWidth
                id="optional_text"
                label="Optional Notes"
                name="optional_text"
                value={formData.optional_text}
                onChange={handleInputChange}
                placeholder="Add any extra notes"
                multiline
                rows={4}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={formData.occurred_at}
                  onChange={(newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      occurred_at: newValue,
                    }))
                  }
                  format="DD/MM/YYYY"
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>

              <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                disabled={isSubmitting}
                sx={{ mt: 1 }}
              >
                {isSubmitting ? "Saving..." : "Save mood Entry"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Box>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
          Your Mood Entries
        </Typography>

        {Moods.length === 0 ? (
          <Alert severity="info">No mood entries yet. Add one above.</Alert>
        ) : (
          <Stack spacing={2}>
            {Moods.map((mood) => (
              <Card key={mood._id}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        mood Level: {mood.value}/10
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                      >
                        <strong>Date:</strong>{" "}
                        {dayjs(mood.occurred_at).format("DD/MM/YYYY")}
                      </Typography>
                      {mood.optional_text && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Notes:</strong> {mood.optional_text}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditStart(mood)}
                        color="primary"
                        title="Edit mood entry"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteStart(mood)}
                        color="error"
                        title="Delete mood entry"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>

      <Dialog
        open={editingId !== null}
        onClose={handleEditCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit mood Entry</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {editError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {editError}
            </Alert>
          )}
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Box>
              <Typography gutterBottom>
                mood Value: {editFormData.value}/10
              </Typography>
              <Slider
                value={Number(editFormData.value)}
                onChange={(_, newValue) =>
                  handleEditSliderChange("value", newValue)
                }
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={10}
              />
            </Box>

            <TextField
              fullWidth
              id="edit-optional_text"
              label="Optional Notes"
              name="optional_text"
              value={editFormData.optional_text}
              onChange={handleEditChange}
              multiline
              rows={4}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={editFormData.occurred_at}
                onChange={(newValue) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    occurred_at: newValue,
                  }))
                }
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel}>Cancel</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            color="primary"
            disabled={isEditSubmitting}
          >
            {isEditSubmitting ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete mood Entry?</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Are you sure you want to delete this mood entry? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Mood;
