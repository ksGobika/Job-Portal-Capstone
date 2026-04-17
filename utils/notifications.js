export const sendNotification = async (userId, message, type) => {
  const notification = {
    userId,
    message,
    type, // 'status_update', 'new_job', 'message'
    isRead: false,
    createdAt: new Date().toISOString()
  };

  await fetch('http://localhost:5000/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notification)
  });
};