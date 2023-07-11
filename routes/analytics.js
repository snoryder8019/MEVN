const express = require('express');
const router = express.Router();
const { google } = require('googleapis');

// Define the Google My Business API client
const ggmb = google.mybusiness('v4');

// Define the route to get the locations owned by the user's account
router.get('/locations', async (req, res) => {
  try {
    const accessToken = req.user.accessToken; // Assuming you saved the access token during authentication

    // Create an authentication client and set the access token
    const authClient = new google.auth.OAuth2();
    authClient.setCredentials({ access_token: accessToken });

    // Call the Google My Business API to get the locations
    const response = await ggmb.accounts.locations.list({
      name: 'accounts/self',
      auth: authClient,
    });

    const locations = response.data.locations;

    // Return the locations as JSON
    res.json(locations);
  } catch (error) {
    console.error('Error retrieving locations:', error);
    res.status(500).json({ error: 'Failed to retrieve locations' });
  }
});

module.exports = router;
