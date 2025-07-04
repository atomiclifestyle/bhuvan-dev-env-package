const { Client } = require('pg');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'admin',
  password: 'securepassword',
  database: 'bhuvan_data',
});

const url = `https://bhuvan-app1.nrsc.gov.in/api/routing/curl_routing_state.php?lat1=29.66&lon1=77.63&lat2=25.33&lon2=82.70&token=${process.env.ROUTE_TOKEN}`;

async function main() {
  let geojsonFeature;

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    console.log(response.data);

    geojsonFeature = response.data.features?.[1];
    if (!geojsonFeature) {
      console.error('No GeoJSON feature found in API response.');
      return;
    }

    console.log('Received feature:', geojsonFeature.properties.name);
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.statusText);
    } else {
      console.error('Request Error:', error.message);
    }
    return;
  }

  try {
    await client.connect();
    console.log('Connected to PostGIS');

    await client.query(`
      CREATE EXTENSION IF NOT EXISTS postgis;
      CREATE TABLE IF NOT EXISTS geo_points (
        id SERIAL PRIMARY KEY,
        name TEXT,
        geom GEOMETRY(Point, 4326)
      );
    `);

    await client.query(
      `INSERT INTO geo_points (name, geom) VALUES ($1, ST_SetSRID(ST_GeomFromGeoJSON($2), 4326))`,
      [geojsonFeature.properties.name, JSON.stringify(geojsonFeature.geometry)]
    );

    console.log('Inserted GeoJSON feature');

    const res = await client.query(`
      SELECT id, name, ST_AsGeoJSON(geom)::json AS geometry FROM geo_points
    `);

    const features = res.rows.map(row => ({
      type: 'Feature',
      geometry: row.geometry,
      properties: {
        id: row.id,
        name: row.name,
      },
    }));

    const geojson = {
      type: 'FeatureCollection',
      features,
    };

    console.log('Retrieved GeoJSON:', JSON.stringify(geojson, null, 2));
  } catch (err) {
    console.error('Database Error:', err);
  } finally {
    await client.end();
  }
}

main();
