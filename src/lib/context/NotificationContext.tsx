'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useTenant } from './TenantContext';
import { useAuth } from '@/hooks/useAuth';
import { notificationService } from '@/services/notification.service';
import { Notification } from '@/features/notifications';
import { useToast } from '@/components/system/Toast/useToast';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { currentOrganization } = useTenant();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!currentOrganization) return;
    setLoading(true);
    try {
      const data = await notificationService.getNotifications(currentOrganization.id);
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [currentOrganization]);

  useEffect(() => {
    if (user && currentOrganization) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, currentOrganization, fetchNotifications]);

  useEffect(() => {
    if (!user || !currentOrganization) return;

    const handleNewNotification = (newNotification: Notification) => {
      // Ensure the notification is for the current tenant
      if (newNotification.tenantId === currentOrganization.id) {
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        showToast({
          type: 'info',
          title: newNotification.title,
          description: newNotification.message,
        });
      }
    };

    // Subscribe to real-time events
    const unsubscribe = notificationService.subscribeToNotifications(handleNewNotification);

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [user, currentOrganization, showToast]);

  const markAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id && !n.read ? { ...n, read: true } : n)));
    setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    try {
      await notificationService.markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read', error);
      // Revert optimistic update on failure
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: false } : n)));
      setUnreadCount((prev) => prev + 1);
    }
  };

  const markAllAsRead = async () => {
    if (!currentOrganization) return;
    const originalNotifications = [...notifications];
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await notificationService.markAllAsRead(currentOrganization.id);
    } catch (error) {
      console.error('Failed to mark all as read', error);
      // Revert on failure
      setNotifications(originalNotifications);
      setUnreadCount(originalNotifications.filter((n) => !n.read).length);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
