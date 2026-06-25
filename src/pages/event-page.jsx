import { useState, useEffect } from 'react';
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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { fetchData, createEvent, updateEvent, deleteEvent } from '../services/api';

const capitalizeCategory = (capCat) => {
  return capCat
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

function Event() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    occurred_at: dayjs(),
  });

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    occurred_at: dayjs(),
  });
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);

  // delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const VALID_CATEGORIES = ['medication', 'therapy', 'life_event', 'appointment', 'other'];

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchData('/events');
      setEvents(data.events || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate required fields
    if (!formData.title.trim()) {
      setSubmitError('Title is required');
      return;
    }

    if (!VALID_CATEGORIES.includes(formData.category)) {
      setSubmitError('Invalid category selected');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createEvent({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        category: formData.category,
        occurred_at: formData.occurred_at.toISOString(),
      });

      // add the new event to the list
      setEvents(prev => [response.event, ...prev]);

      // reset form
      setFormData({
        title: '',
        description: '',
        category: 'other',
        occurred_at: dayjs(),
      });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStart = (event) => {
    setEditingId(event._id);
    setEditFormData({
      title: event.title,
      description: event.description || '',
      category: event.category,
      occurred_at: dayjs(event.occurred_at),
    });
    setEditError(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditFormData({
      title: '',
      description: '',
      category: 'other',
      occurred_at: dayjs(),
    });
    setEditError(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditDateChange = (newValue) => {
    setEditFormData(prev => ({
      ...prev,
      occurred_at: newValue,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError(null);

    // validate required fields
    if (!editFormData.title.trim()) {
      setEditError('Title is required');
      return;
    }

    if (!VALID_CATEGORIES.includes(editFormData.category)) {
      setEditError('Invalid category selected');
      return;
    }

    try {
      setIsEditSubmitting(true);
      const response = await updateEvent(editingId, {
        title: editFormData.title.trim(),
        description: editFormData.description.trim() || undefined,
        category: editFormData.category,
        occurred_at: editFormData.occurred_at.toISOString(),
      });

      // update the event in the list
      setEvents(prev =>
        prev.map(event => (event._id === editingId ? response.event : event))
      );

      handleEditCancel();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleDeleteStart = (event) => {
    setEventToDelete(event);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    // remove the event from the list
    try {
      setIsDeleting(true);
      await deleteEvent(eventToDelete._id);

      setEvents(prev => prev.filter(event => event._id !== eventToDelete._id));

      setDeleteConfirmOpen(false);
      setEventToDelete(null);
    } catch (err) {
      setDeleteConfirmOpen(false);
      setEventToDelete(null);
      setError('Failed to delete event: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setEventToDelete(null);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
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
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Events
      </Typography>

      {/* event creation form */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
            Create New Event
          </Typography>

          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                id="title"
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Event title"
                required
              />

              <TextField
                fullWidth
                id="description"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Event description (optional)"
                multiline
                rows={4}
              />

              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category"
                >
                  {VALID_CATEGORIES.map(cat => (
                    <MenuItem key={cat} value={cat}>
                      {capitalizeCategory(cat)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={formData.occurred_at}
                  onChange={(newValue) =>
                    setFormData(prev => ({
                      ...prev,
                      occurred_at: newValue,
                    }))
                  }
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
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
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* events list */}
      <Box>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
          Your Events
        </Typography>

        {events.length === 0 ? (
          <Alert severity="info">No events yet. Create one above!</Alert>
        ) : (
          <Stack spacing={2}>
            {events.map(event => (
              <Card key={event._id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        <strong>Category:</strong> {capitalizeCategory(event.category)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        <strong>Date:</strong> {dayjs(event.occurred_at).format('DD/MM/YYYY')}
                      </Typography>
                      {event.description && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Description:</strong> {event.description}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditStart(event)}
                        color="primary"
                        title="Edit event"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteStart(event)}
                        color="error"
                        title="Delete event"
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

      {/* edit dialog */}
      <Dialog open={editingId !== null} onClose={handleEditCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {editError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {editError}
            </Alert>
          )}
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              id="edit-title"
              label="Title"
              name="title"
              value={editFormData.title}
              onChange={handleEditChange}
              placeholder="Event title"
              required
            />

            <TextField
              fullWidth
              id="edit-description"
              label="Description"
              name="description"
              value={editFormData.description}
              onChange={handleEditChange}
              placeholder="Event description (optional)"
              multiline
              rows={4}
            />

            <FormControl fullWidth>
              <InputLabel id="edit-category-label">Category</InputLabel>
              <Select
                labelId="edit-category-label"
                id="edit-category"
                name="category"
                value={editFormData.category}
                onChange={handleEditChange}
                label="Category"
              >
                {VALID_CATEGORIES.map(cat => (
                  <MenuItem key={cat} value={cat}>
                    {capitalizeCategory(cat)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={editFormData.occurred_at}
                onChange={handleEditDateChange}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: { fullWidth: true },
                }}
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
            {isEditSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
{/* delete confirmation dialog */}
      <Dialog 
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Event?</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.
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
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Event;