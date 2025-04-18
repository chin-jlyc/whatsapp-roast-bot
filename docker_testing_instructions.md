# Docker Testing Instructions

This document provides step-by-step instructions for testing the Docker setup for the WhatsApp Roast Bot.

## Prerequisites

Before testing, ensure you have:

1. Docker installed on your system
   - [Install Docker on Windows](https://docs.docker.com/desktop/install/windows-install/)
   - [Install Docker on macOS](https://docs.docker.com/desktop/install/mac-install/)
   - [Install Docker on Linux](https://docs.docker.com/engine/install/)

2. Git installed on your system
3. A WhatsApp account for testing
4. A Gemini API key from [Google AI Studio](https://ai.google.dev/)

## Testing Steps

### 1. Clone the Repository

```bash
git clone https://github.com/chin-jlyc/whatsapp-roast-bot.git
cd whatsapp-roast-bot
```

### 2. Configure Environment Variables

```bash
# Create .env file from example
cp .env.example .env

# Edit the .env file with your actual Gemini API key
# You can use any text editor (nano, vim, etc.)
nano .env
```

Update the following variables in the .env file:
- `GEMINI_API_KEY`: Your actual Gemini API key
- `BOT_NAME`: Customize if desired (default is fine)
- `BOT_TRIGGER`: Customize if desired (default is fine)

### 3. Build the Docker Image

```bash
docker build -t whatsapp-roast-bot .
```

This command builds a Docker image named "whatsapp-roast-bot" using the Dockerfile in the current directory.

### 4. Run the Container in Interactive Mode

```bash
docker run -it --name roast-bot \
  --env-file .env \
  -v $(pwd)/.wwebjs_auth:/usr/src/app/.wwebjs_auth \
  whatsapp-roast-bot
```

For Windows Command Prompt, use:
```cmd
docker run -it --name roast-bot ^
  --env-file .env ^
  -v %cd%\.wwebjs_auth:/usr/src/app/.wwebjs_auth ^
  whatsapp-roast-bot
```

For Windows PowerShell, use:
```powershell
docker run -it --name roast-bot `
  --env-file .env `
  -v ${PWD}/.wwebjs_auth:/usr/src/app/.wwebjs_auth `
  whatsapp-roast-bot
```

### 5. Authenticate WhatsApp

When the container starts, you should see a QR code in the terminal:
- Open WhatsApp on your phone
- Go to Settings > Linked Devices
- Tap "Link a Device" and scan the QR code

### 6. Test the Bot

After successful authentication, you should see "WhatsApp client is ready!" in the logs.

To test the bot:
1. Send a message to yourself or a test group with the bot's trigger word
2. Example: `@RoastBot I want to create an app that delivers pizza via carrier pigeons`
3. The bot should respond with a humorous roast of your business idea

### 7. Stop the Interactive Container

Once testing is complete, press `Ctrl+C` to stop the container, then:

```bash
docker rm roast-bot
```

### 8. Run in Production Mode (Background)

If the interactive test was successful, you can run the bot in detached mode:

```bash
docker run -d --name roast-bot \
  --env-file .env \
  -v $(pwd)/.wwebjs_auth:/usr/src/app/.wwebjs_auth \
  --restart unless-stopped \
  whatsapp-roast-bot
```

Adjust the command for Windows as shown in step 4.

### 9. Verify Production Mode

Check that the container is running:

```bash
docker ps
```

View the logs:

```bash
docker logs roast-bot
```

## Troubleshooting

### Container Exits Immediately

If the container exits immediately after starting:

1. Check the logs:
   ```bash
   docker logs roast-bot
   ```

2. Common issues:
   - Missing or incorrect environment variables
   - Insufficient permissions for the mounted volume

### QR Code Not Displaying

If the QR code doesn't appear:

1. Ensure your terminal supports displaying QR codes
2. Try running with a different terminal
3. Check if there are any error messages in the logs

### Authentication Issues

If authentication fails:

1. Remove the existing authentication data:
   ```bash
   rm -rf .wwebjs_auth
   ```

2. Restart the container in interactive mode
3. Try scanning the QR code again

### Gemini API Issues

If the bot starts but doesn't respond with roasts:

1. Check the logs for API errors
2. Verify your API key is correct in the .env file
3. Ensure you have sufficient quota in your Google AI Studio account

## Next Steps

After successful testing, you can:

1. Deploy to GCP following the instructions in the README.md
2. Customize the bot's behavior by modifying the source code
3. Set up monitoring and logging for production use
