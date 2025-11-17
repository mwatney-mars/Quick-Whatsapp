<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Quick WhatsApp

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Run with Docker

**Prerequisites:** Docker

### Using Docker Compose (Recommended)

1.  **Start the application:**
    ```bash
    docker-compose up -d
    ```
    The application will be available at [http://localhost:8080](http://localhost:8080).

2.  **Stop the application:**
    ```bash
    docker-compose down
    ```

### Using Docker

1.  **Build the Docker image:**
    ```bash
    docker build -t quick-whatsapp .
    ```

2.  **Run the Docker container:**
    ```bash
    docker run -d -p 8080:80 --name quick-whatsapp quick-whatsapp
    ```
    The application will be available at [http://localhost:8080](http://localhost:8080).

3.  **Stop the container:**
    ```bash
    docker stop quick-whatsapp
    ```

4.  **Remove the container:**
    ```bash
    docker rm quick-whatsapp
    ```
