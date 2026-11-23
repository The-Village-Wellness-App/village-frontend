
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import {
  fetchData,
  createPain,
  updatePain,
  deletePain,
} from "../services/api";

const painLocations = [
  { value: "all_over", label: "All over" },
  { value: "head", label: "Head" },
  { value: "neck", label: "Neck" },
  { value: "throat", label: "Throat" },
  { value: "shoulders", label: "Shoulders" },
  { value: "back", label: "Back" },
  { value: "chest", label: "Chest" },
  { value: "abdomen", label: "Abdomen" },
  { value: "arms", label: "Arms" },
  { value: "hands", label: "Hands" },
  { value: "pelvic_region", label: "Pelvic region" },
  { value: "upper_legs", label: "Upper legs" },
  { value: "lower_legs", label: "Lower legs" },
  { value: "feet", label: "Feet" },
];

function Pain() {
  const [pains, setPains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editingPain, setEditingPain] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    value: 1,
    location: "",
    optional_text: "",
    occurred_at: dayjs(),
  });

  // Load pain records when the page opens.
  // State updates happen in promise callbacks rather than synchronously
  // inside the effect.
  useEffect(() => {
    let isMounted = true;

    fetchData("/pains")
      .then((response) => {
        if (!isMounted) return;

        setPains(response?.data || []);
        setError("");
      })
      .catch((err) => {
        if (!isMounted) return;

        setError(err.message || "Unable to load pain records.");
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Reload pain records after creating, editing or deleting.
  const loadPains = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetchData("/pains");
      setPains(response?.data || []);
    } catch (err) {
      setError(err.message || "Unable to load pain records.");
    } finally {
      setLoading(false);
    }
  };

  // Reset the form.
  const resetForm = () => {
    setFormData({
      value: 1,
      location: "",
      optional_text: "",
      occurred_at: dayjs(),
    });

    setEditingPain(null);
    setSubmitError("");
  };

  // Update form fields.
  const handleChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Create or update a pain record.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    const painValue = Number(formData.value);

    if (
      !Number.isInteger(painValue) ||
      painValue < 1 ||
      painValue > 10
    ) {
      setSubmitError("Please select a pain level between 1 and 10.");
      return;
    }

    if (!formData.location) {
      setSubmitError("Please select a pain location.");
      return;
    }

    if (
      !formData.occurred_at ||
      !dayjs(formData.occurred_at).isValid()
    ) {
      setSubmitError("Please select a valid date and time.");
      return;
    }

    const painData = {
      value: painValue,
      location: formData.location,
      optional_text: formData.optional_text.trim(),
      occurred_at: dayjs(formData.occurred_at).toISOString(),
    };

    try {
      setIsSubmitting(true);

      if (editingPain) {
        await updatePain(editingPain._id, painData);
      } else {
        await createPain(painData);
      }

      resetForm();
      await loadPains();
    } catch (err) {
      setSubmitError(err.message || "Unable to save pain record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Populate the form when editing a record.
  const handleEdit = (pain) => {
    setEditingPain(pain);

    setFormData({
      value: Number(pain.value),
      location: pain.location || "",
      optional_text: pain.optional_text || "",
      occurred_at: dayjs(pain.occurred_at),
    });

    setSubmitError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete a pain record.
  const handleDelete = async () => {
    if (!deleteTarget || isDeleting) return;

    try {
      setIsDeleting(true);

      await deletePain(deleteTarget._id);

      setDeleteTarget(null);
      await loadPains();
    } catch (err) {
      setError(err.message || "Unable to delete pain record.");
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Return a descriptive pain level.
  const getPainLabel = (value) => {
    if (value <= 3) return "Mild";
    if (value <= 6) return "Moderate";
    return "Severe";
  };

  // Return a readable location name.
  const getLocationLabel = (location) => (
    painLocations.find((item) => item.value === location)?.label ||
    location
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Pain Tracking
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Record and monitor your pain levels over time.
        </Typography>

        {/* Pain entry form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 3,
            mb: 4,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {editingPain ? "Update Pain Record" : "Record Pain"}
          </Typography>

          {/* Pain level */}
          <Typography gutterBottom>
            Pain Value: {formData.value}/10
          </Typography>

          <Slider
            value={Number(formData.value)}
            min={1}
            max={10}
            step={1}
            marks
            valueLabelDisplay="auto"
            onChange={(_, value) => handleChange("value", value)}
            aria-label="Pain level"
            sx={{ mb: 1 }}
          />

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            1 = Mild pain · 10 = Worst pain
          </Typography>

          {/* Pain location */}
          <FormControl fullWidth sx={{ mb: 3 }} required>
            <InputLabel id="pain-location-label">
              Location
            </InputLabel>

            <Select
              labelId="pain-location-label"
              id="pain-location"
              value={formData.location}
              label="Location"
              onChange={(event) =>
                handleChange("location", event.target.value)
              }
            >
              {painLocations.map((location) => (
                <MenuItem key={location.value} value={location.value}>
                  {location.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Optional notes */}
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Additional notes (optional)"
            value={formData.optional_text}
            onChange={(event) =>
              handleChange("optional_text", event.target.value)
            }
            sx={{ mb: 3 }}
          />

          {/* Date and time */}
          <DateTimePicker
            label="Date and time"
            value={formData.occurred_at}
            onChange={(value) => handleChange("occurred_at", value)}
            slotProps={{
              textField: {
                fullWidth: true,
                sx: { mb: 3 },
              },
            }}
          />

          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : editingPain
                  ? "Update Record"
                  : "Save Record"}
            </Button>

            {editingPain && (
              <Button
                type="button"
                variant="outlined"
                onClick={resetForm}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>

        {/* Pain history */}
        <Typography variant="h5" gutterBottom>
          Pain History
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : pains.length === 0 ? (
          <Typography color="text.secondary">
            No pain entries yet. Add one above.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {pains.map((pain) => (
              <Box
                key={pain._id}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6">
                      {pain.value}/10 — {getPainLabel(Number(pain.value))}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {getLocationLabel(pain.location)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {dayjs(pain.occurred_at).format(
                        "DD MMM YYYY, h:mm A",
                      )}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      onClick={() => handleEdit(pain)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      onClick={() => setDeleteTarget(pain)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>

                {pain.optional_text && (
                  <Typography sx={{ mt: 2 }}>
                    {pain.optional_text}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Delete confirmation */}
        <Dialog
          open={Boolean(deleteTarget)}
          onClose={() => {
            if (!isDeleting) setDeleteTarget(null);
          }}
        >
          <DialogTitle>Delete pain record?</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this pain record? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>

            <Button
              color="error"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}

export default Pain;
