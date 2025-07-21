import express from "express";
import * as tar from "tar-stream";
import { PassThrough } from "stream";

const app = express();
const port = 5000;

const getFunctionsContent = (user_id) => `
const base = "https://bhuvan-kit-backend.onrender.com";

export const getRouting = async (lat1, lon1, lat2, lon2) => {
    try {
      const res = await fetch(
        \`\${base}/api/bhuvan/routing?lat1=\${lat1}&lon1=\${lon1}&lat2=\${lat2}&lon2=\${lon2}\`,
        {
          headers: {
            'x-user-id': '${user_id}'
          }
        }
      );
      if (!res.ok) throw new Error('Failed to fetch routing data');
      return await res.json();
    } catch (err) {
      return { error: err.message };
    }
};

export const getThematicData = async (lat, lon, year) => {
    try {
      const res = await fetch(
        \`\${base}/api/bhuvan/thematic?lat=\${lat}&lon=\${lon}&year=\${year}\`,
        {
          headers: {
            'x-user-id': '${user_id}'
          }
        }
      );
      if (!res.ok) throw new Error('Failed to fetch thematic data');
      return await res.json();
    } catch (err) {
      return { error: err.message };
    }
};

export const villageGeocoding = async (category) => {
    try {
      const res = await fetch(
        \`\${base}/api/bhuvan/vg?village=\${category}\`,
        {
          headers: {
            'x-user-id': '${user_id}'
          }
        }
      );
      if (!res.ok) throw new Error('Failed to add POI');
      return await res.json();
    } catch (err) {
      return { error: err.message };
    }
};

export const getEllipsoid = async (id) => {
    try {
      const res = await fetch(
        \`\${base}/api/bhuvan/ellipsoid?id=\${id}\`,
        {
          headers: {
            'x-user-id': '${user_id}'
          }
        }
      );
      if (!res.ok) throw new Error('Failed to download ellipsoid file');
      
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`\${id}.zip\`;
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
};

export const createUser = async () => {
    try {
      const res = await fetch(
        \`\${base}/api/bhuvan/create-user-db\`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': '${user_id}'
          }
        }
      );
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (err) {
      return { error: err.message };
    }
};

export const executeQuery = async (query) => {
    try {
      const res = await fetch(
        \`\${base}/api/bhuvan/execute-query\`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': '${user_id}'
          },
          // FIX: The entire body object must be stringified.
          body: JSON.stringify({ query: query })
        }
      );
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (err) {
      return { error: err.message };
    }
};

export const executeCentralQuery = async (query) => {
    try {
      const res = await fetch(
        \`\${base}/api/bhuvan/execute-central-query\`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': '${user_id}'
          },
          // FIX: The entire body object must be stringified.
          body: JSON.stringify({ query: query })
        }
      );
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (err) {
      return { error: err.message };
    }
};
`;

app.get('/api/download', (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: 'x-user-id' header is missing." });
    }

    try {
        // 2. Create a tar stream
        const pack = tar.pack();

        // 3. Add files to the archive
        pack.entry({ name: 'package/package.json' }, JSON.stringify({
            name: "bhuvan-api",
            version: "1.0.1",
            main: "bhuvan-api.js",
            type: "module"
        }, null, 2));

        pack.entry({ name: 'package/bhuvan-api.js' }, getFunctionsContent(userId));
        pack.entry({ name: 'package/bhuvan-api.d.ts' }, `export function getRouting(...): Promise<any>;`);
        
        pack.finalize();

        // 4. Stream the file back to the user
        res.setHeader('Content-Type', 'application/gzip');
        res.setHeader('Content-Disposition', 'attachment; filename="bhuvan-api.tar.gz"');
        pack.pipe(res);

    } catch (error) {
        console.error("Failed to create tarball:", error);
        res.status(500).json({ error: "Failed to create tarball" });
    }
});

// To run: npm install express tar-stream, then node server.js
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});