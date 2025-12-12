import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  CreditCard,
  Truck,
  FileText,
  X,
  Settings
} from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'credit_alert',
    title: 'Credit Limit Warning',
    message: 'You have utilized 75% of your credit limit (₹11,25,000 of ₹15,00,000)',
    timestamp: '2025-01-05 14:30',
    priority: 'high',
    read: false,
    icon: CreditCard
  },
  {
    id: 2,
    type: 'dispatch',
    title: 'Dispatch Confirmation',
    message: 'Order DO-2025-001 has been dispatched via Vehicle No. MH12AB1234',
    timestamp: '2025-01-05 12:15',
    priority: 'medium',
    read: false,
    icon: Truck
  },
  {
    id: 3,
    type: 'debit_note',
    title: 'Debit Note Status',
    message: 'Debit Note DN-001 has been processed and approved',
    timestamp: '2025-01-05 10:45',
    priority: 'low',
    read: true,
    icon: FileText
  },
  {
    id: 4,
    type: 'system',
    title: 'Welcome Back',
    message: 'You have successfully logged into the DMS portal',
    timestamp: '2025-01-05 09:00',
    priority: 'low',
    read: true,
    icon: CheckCircle
  },
  {
    id: 5,
    type: 'credit_alert',
    title: 'Payment Reminder',
    message: 'Outstanding amount of ₹66,150 is due for payment',
    timestamp: '2025-01-04 16:20',
    priority: 'high',
    read: false,
    icon: AlertTriangle
  }
];

const alerts = [
  {
    id: 1,
    type: 'credit_limit',
    title: 'Credit Utilization Alert',
    description: 'Set alerts when credit utilization exceeds threshold',
    threshold: '75%',
    enabled: true
  },
  {
    id: 2,
    type: 'dispatch_status',
    title: 'Dispatch Status Updates',
    description: 'Get notified about dispatch confirmations and deliveries',
    threshold: 'Immediate',
    enabled: true
  },
  {
    id: 3,
    type: 'payment_due',
    title: 'Payment Due Reminders',
    description: 'Receive reminders for outstanding payments',
    threshold: '3 days before',
    enabled: true
  },
  {
    id: 4,
    type: 'low_stock',
    title: 'Low Stock Alerts',
    description: 'Get notified when SKU stock levels are low',
    threshold: '< 10 units',
    enabled: false
  }
];

export function Notifications() {
  const [notificationList, setNotificationList] = useState(notifications);
  const [alertSettings, setAlertSettings] = useState(alerts);

  const unreadCount = notificationList.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotificationList(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationList(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotificationList(prev => prev.filter(notification => notification.id !== id));
  };

  const toggleAlertSetting = (id) => {
    setAlertSettings(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
      )
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 3600);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Bell className="w-8 h-8 mr-3" />
            Notifications
          </h1>
          <p className="text-muted-foreground">Stay updated with alerts and system notifications</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {unreadCount} unread
          </Badge>
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {/* <TabsTrigger value="settings">Alert Settings</TabsTrigger> */}
        </TabsList>

        <TabsContent value="notifications">
          <div className="space-y-4">
            {notificationList.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No notifications</h3>
                  <p className="text-muted-foreground">You're all caught up!</p>
                </CardContent>
              </Card>
            ) : (
              notificationList.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <Card key={notification.id} className={`${!notification.read ? 'border-l-4 border-l-primary' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </h4>
                              <Badge variant={getPriorityBadge(notification.priority)} className="text-xs">
                                {notification.priority}
                              </Badge>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                            <p className={`text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground mt-2">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTimestamp(notification.timestamp)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 ml-4">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Alert Settings
              </CardTitle>
              <CardDescription>
                Configure when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {alertSettings.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <div className="text-xs text-muted-foreground mt-1">
                      Threshold: {alert.threshold}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={alert.enabled ? 'default' : 'secondary'}>
                      {alert.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAlertSetting(alert.id)}
                    >
                      {alert.enabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive important alerts via email</p>
                  </div>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS Alerts</h4>
                    <p className="text-sm text-muted-foreground">Get critical alerts via SMS</p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}