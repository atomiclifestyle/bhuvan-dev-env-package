# bhuvan-projects-base

## How to Install

```bash
npm install bhuvan-dev-env-client
```
## How to Use

```bash
import { createBhuvanClient } from 'bhuvan-dev-env-client';

// The user's unique ID
const myUserId = "user-abc-123";

// 1. Initialize the client with the user's ID
const bhuvan = createBhuvanClient(myUserId);

// 2. Call the simplified functions directly
async function run() {
  try {
    const routingData = await bhuvan.getRouting(17, 78, 18, 79);
    console.log("Routing Data:", routingData);

    const queryResult = await bhuvan.executeCentralQuery("SELECT * FROM villages");
    console.log("Query Result:", queryResult);
  } catch (error) {
    console.error("API call failed:", error.message);
  }
}

run();
```
