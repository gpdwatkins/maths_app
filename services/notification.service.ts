// Notification service - handles push notifications

import { supabase } from './supabase';

export const notificationService = {
  // Send root notification
  async sendRootNotification(postOwnerId: string, rooterUsername: string): Promise<void> {
    // TODO: Create notification record
    // In production, trigger push notification
    
    await supabase.from('notifications').insert({
      user_id: postOwnerId,
      type: 'root',
      message: `${rooterUsername} rooted your post`,
    });
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
  },
};