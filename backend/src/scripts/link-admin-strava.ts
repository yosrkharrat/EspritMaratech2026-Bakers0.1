import dotenv from 'dotenv';
import axios from 'axios';
import { dbHelper } from '../db';

dotenv.config();

async function main() {
  const clientId = process.env.STRAVA_CLIENT_ID || '201108';
  const clientSecret = process.env.STRAVA_CLIENT_SECRET || '306d4e68a83f98e1a5ac0af70473e824ea796402';
  let accessToken = process.env.STRAVA_ACCESS_TOKEN || 'baa2db7bbe78eabf0cb92ecb8f976c4ca7c04461';
  let refreshToken = process.env.STRAVA_REFRESH_TOKEN || '09024f1088b537c3086de8a6f541bf7d49d4aa8a';

  const adminEmail = 'admin@rct.tn';
  const admin = dbHelper.getUserByEmail(adminEmail);
  if (!admin) {
    console.error(`Admin user not found by email ${adminEmail}`);
    process.exit(1);
  }

  try {
    // First, try to use the access token directly
    console.log('Fetching athlete info from Strava...');
    let athleteResp;
    let expiresAt;
    
    try {
      athleteResp = await axios.get('https://www.strava.com/api/v3/athlete', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // Token is valid, calculate expiry
      expiresAt = Math.floor(new Date('2026-02-08T13:12:27Z').getTime() / 1000);
    } catch (err: any) {
      if (err.response?.status === 401) {
        // Token expired, try to refresh
        console.log('Access token expired, refreshing...');
        const tokenResp = await axios.post('https://www.strava.com/oauth/token', {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        });

        accessToken = tokenResp.data.access_token;
        refreshToken = tokenResp.data.refresh_token || refreshToken;
        expiresAt = tokenResp.data.expires_at;
        
        console.log(`Got new access token, expires at: ${new Date(expiresAt * 1000).toISOString()}`);

        // Fetch athlete info with new token
        athleteResp = await axios.get('https://www.strava.com/api/v3/athlete', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } else {
        throw err;
      }
    }

    const athlete = athleteResp.data;
    if (!athlete || !athlete.id) {
      console.error('Could not fetch athlete from Strava');
      process.exit(1);
    }

    console.log(`Found Strava athlete: ${athlete.firstname} ${athlete.lastname} (ID: ${athlete.id})`);

    // Update admin user with Strava credentials
    dbHelper.updateUser(admin.id, {
      strava_connected: true,
      strava_id: String(athlete.id),
      strava_access_token: accessToken,
      strava_refresh_token: refreshToken,
      strava_token_expires_at: expiresAt,
    } as any);

    console.log(`✅ Successfully linked Strava athlete ${athlete.id} to admin (${adminEmail})`);
    console.log(`   Token expires: ${new Date(expiresAt * 1000).toISOString()}`);
  } catch (err: any) {
    console.error('Error:', err.response?.data || err.message || err);
    process.exit(1);
  }
}

main();
