
# SENA - Backend Proxy Server

This server acts as a secure intermediary (a "proxy") between the SENA frontend application and the Mistral AI API.

## Why is this needed?

1.  **Security**: It keeps your `MISTRAL_API_KEY` safe on the server. If the key were in the frontend code, anyone could steal it from their browser.
2.  **CORS**: Browsers block web pages from making API requests to a different domain (like `mistral.ai`) for security reasons. This is known as the Cross-Origin Resource Sharing (CORS) policy. By having our own server make the request, we bypass this browser limitation.

## Setup & Running

Follow these steps to get the backend server running locally.

### 1. Navigate to the Directory

Open your terminal and navigate into this `api` directory:
```bash
cd api
```

### 2. Install Dependencies

Install the necessary Node.js packages:
```bash
npm install
```

### 3. Create Environment File

Create a `.env` file in this `api` directory. You can copy the example file:
```bash
cp .env.example .env
```
Now, open the `.env` file and replace `YOUR_MISTRAL_API_KEY_HERE` with your actual Mistral API key.

**.env**
```
MISTRAL_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Start the Server

Run the start command:
```bash
npm start
```

If everything is successful, you will see a message like:
`SENA backend proxy server listening on port 3001`

The server is now running and ready to handle requests from the frontend application. **Leave this terminal window open while you are developing.**
