// The base URL for the actual backend service
const BHUVAN_BACKEND_URL = "https://bhuvan-kit-backend.onrender.com";

/**
 * Creates a new Bhuvan API client instance.
 * @param {string} userId - The unique user ID for authentication.
 * @returns {object} An object containing all the simplified API functions.
 */
export function createBhuvanClient(userId) {
  if (!userId) {
    throw new Error("A userId must be provided to create a Bhuvan client.");
  }

  // All functions will use the provided userId for authentication.
  const headers = {
    'x-user-id': userId
  };

  // Return an object containing all the simplified functions
  return {
    /**
     * Fetches routing data between two geographical points.
     * @param {number} lat1 - Latitude of the starting point.
     * @param {number} lon1 - Longitude of the starting point.
     * @param {number} lat2 - Latitude of the destination point.
     * @param {number} lon2 - Longitude of the destination point.
     * @returns {Promise<object>}
     */
    getRouting: async (lat1, lon1, lat2, lon2) => {
      try {
        const params = new URLSearchParams({ lat1, lon1, lat2, lon2 });
        const res = await fetch(
          `${BHUVAN_BACKEND_URL}/api/bhuvan/routing?${params}`,
          { headers }
        );
        if (!res.ok) throw new Error('Failed to fetch routing data');
        return await res.json();
      } catch (err) {
        return { error: err.message };
      }
    },

    /**
     * Fetches thematic data for a specific location and year.
     * @param {number} lat - Latitude of the location.
     * @param {number} lon - Longitude of the location.
     * @param {string} year - The year for the thematic data.
     * @returns {Promise<object>}
     */
    getThematicData: async (lat, lon, year) => {
      try {
        const params = new URLSearchParams({ lat, lon, year });
        const res = await fetch(
          `${BHUVAN_BACKEND_URL}/api/bhuvan/thematic?${params}`,
          { headers }
        );
        if (!res.ok) throw new Error('Failed to fetch thematic data');
        return await res.json();
      } catch (err) {
        return { error: err.message };
      }
    },

    /**
     * Performs geocoding for a village category.
     * @param {string} category - The village category to geocode.
     * @returns {Promise<object>}
     */
    villageGeocoding: async (category) => {
      try {
        const params = new URLSearchParams({ village: category });
        const res = await fetch(
          `${BHUVAN_BACKEND_URL}/api/bhuvan/vg?${params}`,
          { headers }
        );
        if (!res.ok) throw new Error('Failed to add POI');
        return await res.json();
      } catch (err) {
        return { error: err.message };
      }
    },

    /**
     * Downloads an ellipsoid file. This function is intended for browser environments.
     * @param {string} id - The ID of the ellipsoid file to download.
     * @returns {Promise<object>}
     */
    getEllipsoid: async (id) => {
      try {
        const params = new URLSearchParams({ id });
        const res = await fetch(
          `${BHUVAN_BACKEND_URL}/api/bhuvan/ellipsoid?${params}`,
          { headers }
        );
        if (!res.ok) throw new Error('Failed to download ellipsoid file');

        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${id}.zip`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
          return { success: true };
        } else {
          return { warning: 'getEllipsoid is browser-only; use in a browser environment or fetch the blob directly', data: await res.text() };
        }
      } catch (err) {
        return { error: err.message };
      }
    },

    /**
     * Triggers the creation of a user database on the backend.
     * @returns {Promise<object>}
     */
    createUser: async () => {
      try {
        const res = await fetch(
          `${BHUVAN_BACKEND_URL}/api/bhuvan/create-user-db`,
          {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' }
          }
        );
        if (!res.ok) throw new Error('Failed to create user');
        return await res.json();
      } catch (err) {
        return { error: err.message };
      }
    },

    /**
     * Executes a query against the user-specific database.
     * @param {string} query - The query string to execute.
     * @returns {Promise<object>}
     */
    executeQuery: async (query) => {
      try {
        const res = await fetch(
          `${BHUVAN_BACKEND_URL}/api/bhuvan/execute-query`,
          {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
          }
        );
        if (!res.ok) throw new Error('Failed to execute query');
        return await res.json();
      } catch (err) {
        return { error: err.message };
      }
    },

    /**
     * Executes a query against the central database.
     * @param {string} query - The query string to execute.
     * @returns {Promise<object>}
     */
    executeCentralQuery: async (query) => {
      try {
        const res = await fetch(
          `${BHUVAN_BACKEND_URL}/api/bhuvan/execute-central-query`,
          {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
          }
        );
        if (!res.ok) throw new Error('Failed to execute central query');
        return await res.json();
      } catch (err) {
        return { error: err.message };
      }
    }
  };
}
