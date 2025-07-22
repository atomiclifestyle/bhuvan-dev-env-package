const BHUVAN_BACKEND_URL = "https://bhuvan-kit-backend.onrender.com";

export function createBhuvanClient(userId) {
  if (!userId) {
    throw new Error("A userId must be provided to create a Bhuvan client.");
  }

  const headers = {
    'x-user-id': userId
  };

  return {
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
