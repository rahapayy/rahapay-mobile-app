export const logError = (error: any) => {
  // Log error to the console for development
  console.error("Logged Error:", error);

  // Optionally, send error details to a logging service or server
  // Example: sending to a remote server
  /*
    fetch('https://your-logging-service.com/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: {
          message: error.message,
          stack: error.stack,
          // Add any other relevant details here
        },
      }),
    }).catch(err => console.error("Failed to send error log:", err));
    */
};
