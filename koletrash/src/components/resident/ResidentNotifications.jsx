import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  IconButton,
  Box,
  Avatar,
  Stack,
  Divider,
  Badge,
  Paper,
  Tooltip,
  ButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  NotificationsNone as NotificationsNoneIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  PriorityHigh as PriorityHighIcon,
  Home as HomeIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  MarkEmailRead as MarkEmailReadIcon,
} from '@mui/icons-material';

const initialNotifications = [
  { id: 1, title: 'Schedule Update', message: 'Collection is moved to Tuesday this week.', time: '2 hours ago', read: false },
  { id: 2, title: 'Reminder', message: 'Segregate your waste before pickup.', time: '5 hours ago', read: false },
  { id: 3, title: 'Barangay Event', message: 'Clean-up drive this Saturday at 8AM.', time: '1 day ago', read: false },
  { id: 4, title: 'IEC Material', message: 'New IEC material available in your dashboard.', time: '2 days ago', read: false },
  { id: 5, title: 'Holiday Notice', message: 'No collection on June 12 (holiday).', time: '3 days ago', read: false },
  { id: 6, title: 'Feedback Received', message: 'Thank you for your feedback!', time: '4 days ago', read: false },
  { id: 7, title: 'Special Pickup', message: 'Special pickup request approved.', time: '5 days ago', read: false },
  { id: 8, title: 'Barangay Meeting', message: 'Meeting on Friday, 6PM at the hall.', time: '6 days ago', read: false },
  { id: 9, title: 'Weather Alert', message: 'Heavy rain expected tomorrow. Secure your waste.', time: '1 week ago', read: false },
  { id: 10, title: 'Welcome!', message: 'Welcome to the KolekTrash app!', time: '1 week ago', read: false },
];

// Transform notifications for resident context
const transformNotification = (notif, index) => ({
  ...notif,
  type: getResidentType(index),
  priority: getResidentPriority(index),
});

function getResidentType(index) {
  const types = ['schedule', 'reminder', 'event', 'iec', 'system', 'feedback', 'pickup', 'meeting', 'weather', 'welcome'];
  return types[index % types.length];
}

function getResidentPriority(index) {
  const priorities = ['high', 'medium', 'low', 'medium', 'high', 'low', 'medium', 'medium', 'high', 'low'];
  return priorities[index % priorities.length];
}

export default function ResidentNotifications({ notifications = initialNotifications, setNotifications }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Transform notifications for resident context
  const residentNotifications = notifications.map((notif, index) => transformNotification(notif, index));

  const markAllAsRead = () => {
    setNotifications(residentNotifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    const iconProps = { fontSize: 'small' };
    switch (type) {
      case 'schedule': return <ScheduleIcon sx={{ color: '#059669' }} {...iconProps} />;
      case 'reminder': return <InfoIcon sx={{ color: '#10b981' }} {...iconProps} />;
      case 'event': return <EventIcon sx={{ color: '#7c3aed' }} {...iconProps} />;
      case 'iec': return <SchoolIcon sx={{ color: '#16a34a' }} {...iconProps} />;
      case 'system': return <HomeIcon sx={{ color: '#6b7280' }} {...iconProps} />;
      case 'feedback': return <AssessmentIcon sx={{ color: '#f59e0b' }} {...iconProps} />;
      case 'pickup': return <InfoIcon sx={{ color: '#059669' }} {...iconProps} />;
      case 'meeting': return <EventIcon sx={{ color: '#7c3aed' }} {...iconProps} />;
      case 'weather': return <WarningIcon sx={{ color: '#dc2626' }} {...iconProps} />;
      case 'welcome': return <HomeIcon sx={{ color: '#10b981' }} {...iconProps} />;
      default: return <NotificationsNoneIcon sx={{ color: '#6b7280' }} {...iconProps} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'schedule': return '#059669'; // emerald-600
      case 'reminder': return '#10b981'; // emerald-500
      case 'event': return '#7c3aed'; // violet-600
      case 'iec': return '#16a34a'; // green-600
      case 'system': return '#6b7280'; // gray-500
      case 'feedback': return '#f59e0b'; // amber-500
      case 'pickup': return '#059669'; // emerald-600
      case 'meeting': return '#7c3aed'; // violet-600
      case 'weather': return '#dc2626'; // red-600
      case 'welcome': return '#10b981'; // emerald-500
      default: return '#6b7280'; // gray-500
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
          Notifications
        </Typography>
      </Box>

      {/* Filter Section */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<MarkEmailReadIcon />}
          onClick={markAllAsRead}
          disabled={!residentNotifications.some(n => !n.read)}
          sx={{ 
            borderRadius: 2,
            bgcolor: '#059669',
            '&:hover': { bgcolor: '#047857' },
            '&:disabled': { bgcolor: '#9ca3af' },
            minWidth: 160,
            boxShadow: 'none',
            fontSize: 14,
            px: 2,
            py: 1
          }}
        >
          Mark all as read
        </Button>
      </Box>

      {/* Notifications List */}
      <Stack spacing={2}>
        {residentNotifications.map(notification => (
          <Card 
            key={notification.id} 
            variant="outlined" 
            sx={{ 
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              bgcolor: notification.read ? 'grey.50' : 'white',
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 3,
                transform: 'translateY(-2px)'
              }
            }}
            onClick={() => {
              setSelectedNotification(notification);
              setOpenModal(true);
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                {/* Icon */}
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    bgcolor: 'white',
                    border: '2px solid #e0e0e0',
                    color: '#6b7280'
                  }}
                >
                  {getNotificationIcon('default')}
                </Avatar>

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="subtitle1" 
                        fontWeight={notification.read ? 'normal' : 'bold'}
                        sx={{ mb: 0.5 }}
                      >
                        {notification.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mb: 1, lineHeight: 1.4 }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {notification.time}
                      </Typography>
                    </Box>

                    {/* Priority and Actions */}
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={notification.priority.toUpperCase()}
                        size="small"
                        sx={{
                          fontWeight: 'bold',
                          minWidth: 60,
                          ...(notification.priority === 'high' && {
                            bgcolor: '#dc2626',
                            color: 'white'
                          }),
                          ...(notification.priority === 'medium' && {
                            bgcolor: '#f59e0b',
                            color: 'white'
                          }),
                          ...(notification.priority === 'low' && {
                            bgcolor: '#16a34a',
                            color: 'white'
                          })
                        }}
                      />
                      <Tooltip title="Delete notification">
                        <IconButton
                          size="small"
                          onClick={e => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          sx={{ 
                            color: '#dc2626',
                            '&:hover': { bgcolor: '#fef2f2', color: '#dc2626' }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {residentNotifications.length === 0 && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              bgcolor: '#f0fdf4', 
              borderRadius: 2,
              border: '2px dashed #bbf7d0'
            }}
          >
            <NotificationsNoneIcon sx={{ fontSize: 60, color: '#6b7280', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: '#374151' }}>
              No notifications found
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              You're all caught up! 🎉
            </Typography>
          </Paper>
        )}
      </Stack>

      {/* Modal for notification details (match screenshot style) */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: 6 } }}>
        <Box sx={{ bgcolor: 'white', borderRadius: 3, overflow: 'hidden', p: 0, minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {/* Green header with title */}
          <Box sx={{ width: '100%', bgcolor: '#059669', py: 2, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, fontSize: 20, textAlign: 'center', letterSpacing: 0.5 }}>
              {selectedNotification?.title}
            </Typography>
          </Box>
          {/* Message and time */}
          <Box sx={{ width: '100%', px: 3, py: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" sx={{ color: '#374151', mb: 2, textAlign: 'center', fontSize: 16, fontWeight: 500 }}>
              {selectedNotification?.message}
            </Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#f59e0b', fontSize: 15, fontWeight: 600, textAlign: 'center', px: 2, py: 0.5, borderRadius: 2, bgcolor: '#fef3c7', display: 'inline-block' }}>
                {selectedNotification?.time}
              </Typography>
            </Box>
          </Box>
          {/* Close button */}
          <DialogActions sx={{ width: '100%', bgcolor: 'white', justifyContent: 'center', p: 2, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
            <Button onClick={() => setOpenModal(false)} sx={{ color: 'white', bgcolor: '#059669', fontWeight: 700, fontSize: 16, px: 5, py: 1.2, borderRadius: 2, textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#047857' } }}>
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}