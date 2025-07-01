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
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  NotificationsNone as NotificationsNoneIcon,
  Warning as WarningIcon,
  Info,
  PriorityHigh as PriorityHighIcon,
  Delete as RecyclingIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  MarkEmailRead as MarkEmailReadIcon,
} from '@mui/icons-material';

// Transform generic notifications to garbage collector context
const transformNotification = (notif, index) => ({
  ...notif,
  title: getCollectorTitle(notif.message, index),
  type: getCollectorType(index),
  priority: getCollectorPriority(index),
  time: getRelativeTime(index)
});

function getCollectorTitle(message, index) {
  const titles = [
    'Collection Task Update',
    'Area Assignment',
    'Schedule Change',
    'Safety Alert',
    'Special Collection Request',
    'Team Update',
    'Performance Report',
    'Training Available'
  ];
  return titles[index % titles.length] || 'System Notification';
}

function getCollectorType(index) {
  const types = ['task', 'area', 'schedule', 'safety', 'special', 'team', 'report', 'training'];
  return types[index % types.length];
}

function getCollectorPriority(index) {
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

export default function GarbageCollectorNotifications({ notifications = [], setNotifications }) {
  const [filter, setFilter] = useState('all');

  // Transform notifications for garbage collector context
  const collectorNotifications = notifications.map((notif, index) => transformNotification(notif, index));

  const filteredNotifications = collectorNotifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return notification.type === filter;
  });

  const markAllAsRead = () => {
    setNotifications(collectorNotifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    const iconProps = { fontSize: 'small' };
    switch (type) {
      case 'task': return <AssignmentIcon sx={{ color: '#059669' }} {...iconProps} />;
      case 'area': return <RecyclingIcon sx={{ color: '#10b981' }} {...iconProps} />;
      case 'schedule': return <ScheduleIcon sx={{ color: '#059669' }} {...iconProps} />;
      case 'safety': return <SecurityIcon sx={{ color: '#dc2626' }} {...iconProps} />;
      case 'special': return <PriorityHighIcon sx={{ color: '#f59e0b' }} {...iconProps} />;
      case 'team': return <Info sx={{ color: '#16a34a' }} {...iconProps} />;
      case 'report': return <AssessmentIcon sx={{ color: '#16a34a' }} {...iconProps} />;
      case 'training': return <SchoolIcon sx={{ color: '#7c3aed' }} {...iconProps} />;
      default: return <NotificationsNoneIcon sx={{ color: '#6b7280' }} {...iconProps} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'task': return '#059669'; // emerald-600
      case 'area': return '#10b981'; // emerald-500
      case 'schedule': return '#059669'; // emerald-600
      case 'safety': return '#dc2626'; // red-600
      case 'special': return '#f59e0b'; // amber-500
      case 'team': return '#16a34a'; // green-600
      case 'report': return '#16a34a'; // green-600
      case 'training': return '#7c3aed'; // violet-600
      default: return '#6b7280'; // gray-500
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#059669', color: 'white', borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: 'white', color: '#059669' }}>
            <NotificationsNoneIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Notifications
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {collectorNotifications.filter(n => !n.read).length} unread messages
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Filter Section */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
          <Stack direction="row" alignItems="center" spacing={1}>
            <FilterListIcon sx={{ color: '#059669' }} />
            <Typography variant="subtitle1" fontWeight="medium">
              Filter:
            </Typography>
          </Stack>
          <ButtonGroup variant="outlined" size="small">
            {['all', 'unread', 'read'].map((filterOption) => (
              <Button
                key={filterOption}
                variant={filter === filterOption ? 'contained' : 'outlined'}
                onClick={() => setFilter(filterOption)}
                sx={{ 
                  textTransform: 'capitalize',
                  ...(filter === filterOption && {
                    bgcolor: '#059669',
                    borderColor: '#059669',
                    '&:hover': { bgcolor: '#047857' }
                  }),
                  ...((filter !== filterOption) && {
                    borderColor: '#059669',
                    color: '#059669',
                    '&:hover': { bgcolor: '#f0fdf4', borderColor: '#047857' }
                  })
                }}
              >
                {filterOption}
              </Button>
            ))}
          </ButtonGroup>
          <ButtonGroup variant="outlined" size="small">
            {['task', 'area', 'schedule', 'safety'].map((filterOption) => (
              <Button
                key={filterOption}
                variant={filter === filterOption ? 'contained' : 'outlined'}
                onClick={() => setFilter(filterOption)}
                sx={{ 
                  textTransform: 'capitalize',
                  ...(filter === filterOption && {
                    bgcolor: '#059669',
                    borderColor: '#059669',
                    '&:hover': { bgcolor: '#047857' }
                  }),
                  ...((filter !== filterOption) && {
                    borderColor: '#059669',
                    color: '#059669',
                    '&:hover': { bgcolor: '#f0fdf4', borderColor: '#047857' }
                  })
                }}
              >
                {filterOption}
              </Button>
            ))}
          </ButtonGroup>
          <Button
            variant="text"
            startIcon={<MarkEmailReadIcon />}
            onClick={markAllAsRead}
            sx={{ 
              marginLeft: 'auto',
              color: '#059669',
              '&:hover': { bgcolor: '#f0fdf4' }
            }}
          >
            Mark all as read
          </Button>
        </Stack>
      </Paper>

      {/* Notifications List */}
      <Stack spacing={2}>
        {filteredNotifications.map((notification) => (
          <Card
            key={notification.id}
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: notification.read ? '#e5e7eb' : '#059669',
              borderRadius: 2,
              bgcolor: notification.read ? 'white' : '#f0fdf4',
              position: 'relative',
              overflow: 'visible'
            }}
          >
            {!notification.read && (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#059669',
                  position: 'absolute',
                  top: -4,
                  left: -4
                }}
              />
            )}
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar
                    sx={{
                      bgcolor: `${getNotificationColor(notification.type)}15`,
                      color: getNotificationColor(notification.type)
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {notification.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {notification.message}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mt: 1 }}
                  >
                    <Chip
                      label={notification.type}
                      size="small"
                      sx={{
                        bgcolor: `${getNotificationColor(notification.type)}15`,
                        color: getNotificationColor(notification.type),
                        fontWeight: 'medium'
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                    {notification.priority === 'high' && (
                      <Chip
                        icon={<PriorityHighIcon sx={{ fontSize: '14px !important' }} />}
                        label="High Priority"
                        size="small"
                        sx={{
                          bgcolor: '#fee2e2',
                          color: '#dc2626',
                          fontWeight: 'medium',
                          '& .MuiChip-icon': { color: '#dc2626' }
                        }}
                      />
                    )}
                  </Stack>
                </Grid>
                <Grid item>
                  <Tooltip title="Delete notification">
                    <IconButton
                      size="small"
                      onClick={() => deleteNotification(notification.id)}
                      sx={{
                        color: '#6b7280',
                        '&:hover': { color: '#dc2626', bgcolor: '#fee2e2' }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}

        {filteredNotifications.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              border: '1px dashed',
              borderColor: '#d1d5db',
              borderRadius: 2
            }}
          >
            <NotificationsNoneIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No notifications found
            </Typography>
            <Typography variant="body2" color="text.secondary">              {filter === 'all'
                ? "You don't have any notifications yet"
                : `No ${filter} notifications at the moment`}
            </Typography>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}