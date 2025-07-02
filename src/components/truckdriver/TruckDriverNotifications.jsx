// filepath: c:\Users\Emiruuu\Desktop\KOLETRASH\src\components\truckdriver\TruckDriverNotifications.jsx
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
  DirectionsCar as DirectionsCarIcon,
  Schedule as ScheduleIcon,
  Build as BuildIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  MarkEmailRead as MarkEmailReadIcon,
} from '@mui/icons-material';

// Transform generic notifications to truck driver context
const transformNotification = (notif, index) => ({
  ...notif,
  title: getTruckDriverTitle(notif.message, index),
  type: getTruckDriverType(index),
  priority: getTruckDriverPriority(index),
  time: getRelativeTime(index)
});

function getTruckDriverTitle(message, index) {
  const titles = [
    'Route Update',
    'Collection Alert', 
    'Shift Reminder',
    'Vehicle Maintenance',
    'Schedule Change',
    'Safety Notice',
    'Performance Report',
    'Training Available'
  ];
  return titles[index % titles.length] || 'System Notification';
}

function getTruckDriverType(index) {
  const types = ['route', 'collection', 'system', 'maintenance', 'schedule', 'safety', 'report', 'training'];
  return types[index % types.length];
}

function getTruckDriverPriority(index) {
  const priorities = ['high', 'medium', 'low', 'medium'];
  return priorities[index % priorities.length];
}

function getRelativeTime(index) {
  const times = [
    '30 minutes ago',
    '1 hour ago', 
    '2 hours ago',
    '3 hours ago',
    '1 day ago',
    '2 days ago',
    '3 days ago',
    '1 week ago'
  ];
  return times[index % times.length];
}

export default function TruckDriverNotifications({ notifications = [], setNotifications }) {
  const [filter, setFilter] = useState('all');
  const [openModal, setOpenModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Transform notifications for truck driver context
  const driverNotifications = notifications.map((notif, index) => transformNotification(notif, index));

  const filteredNotifications = driverNotifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return notification.type === filter;
  });

  const markAllAsRead = () => {
    setNotifications(driverNotifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    const iconProps = { fontSize: 'small' };
    switch (type) {
      case 'route': return <DirectionsCarIcon sx={{ color: '#059669' }} {...iconProps} />;
      case 'collection': return <InfoIcon sx={{ color: '#10b981' }} {...iconProps} />;
      case 'maintenance': return <BuildIcon sx={{ color: '#f59e0b' }} {...iconProps} />;
      case 'safety': return <SecurityIcon sx={{ color: '#dc2626' }} {...iconProps} />;
      case 'schedule': return <ScheduleIcon sx={{ color: '#059669' }} {...iconProps} />;
      case 'report': return <AssessmentIcon sx={{ color: '#16a34a' }} {...iconProps} />;
      case 'training': return <SchoolIcon sx={{ color: '#7c3aed' }} {...iconProps} />;
      default: return <NotificationsNoneIcon sx={{ color: '#6b7280' }} {...iconProps} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'route': return '#059669'; // emerald-600
      case 'collection': return '#10b981'; // emerald-500
      case 'maintenance': return '#f59e0b'; // amber-500
      case 'safety': return '#dc2626'; // red-600
      case 'schedule': return '#059669'; // emerald-600
      case 'report': return '#16a34a'; // green-600
      case 'training': return '#7c3aed'; // violet-600
      default: return '#6b7280'; // gray-500
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>      {/* Header */}
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
          disabled={!driverNotifications.some(n => !n.read)}
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
      </Box>      {/* Notifications List */}
      <Stack spacing={2}>
        {filteredNotifications.map(notification => (
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
        ))}        {filteredNotifications.length === 0 && (
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
              {filter !== 'all' 
                ? `No ${filter} notifications available` 
                : "You're all caught up! 🎉"}
            </Typography>
          </Paper>
        )}
      </Stack>

      {/* Modal for notification details */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: 6 } }}>
        <Box sx={{ bgcolor: 'white', borderRadius: 3, overflow: 'hidden', p: 0, minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', bgcolor: '#059669', py: 2, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, fontSize: 18, textAlign: 'center', letterSpacing: 0.5 }}>
              {selectedNotification?.title}
            </Typography>
          </Box>
          <Box sx={{ width: '100%', px: 3, py: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" sx={{ color: '#374151', mb: 1.5, textAlign: 'center', fontSize: 15, fontWeight: 500, letterSpacing: 0.1 }}>
              {selectedNotification?.message}
            </Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Typography variant="caption" sx={{ color: '#f59e0b', fontSize: 13, fontWeight: 500, textAlign: 'center', px: 1, py: 0.5, borderRadius: 1, bgcolor: '#fef3c7', display: 'inline-block' }}>
                {selectedNotification?.time}
              </Typography>
            </Box>
          </Box>
          <DialogActions sx={{ width: '100%', bgcolor: 'white', justifyContent: 'center', p: 1, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
            <Button onClick={() => setOpenModal(false)} sx={{ color: 'white', bgcolor: '#059669', fontWeight: 600, fontSize: 14, px: 3, py: 1, borderRadius: 2, textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#047857' } }}>
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}