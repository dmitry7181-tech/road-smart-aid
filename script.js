// script.js

// Function to get the current date and time in UTC format
function getCurrentDateTimeUTC() {
    const now = new Date();
    const utcDateTime = now.toISOString().replace('T', ' ').substring(0, 19);
    return utcDateTime;
}

// Example usage
console.log('Current Date and Time (UTC):', getCurrentDateTimeUTC());