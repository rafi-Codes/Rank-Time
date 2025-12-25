# OpenRouter AI Integration

The Rank Buddy chat feature now uses OpenRouter's AI API instead of local implementations.

## Setup

1. **API Key**: The OpenRouter API key is configured in `.env.local`:
   ```
   OPENROUTER_API_KEY=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
   ```

2. **Dependencies**: The `@openrouter/sdk` package is installed and configured.

## How It Works

- **Model**: Uses `openai/gpt-4o` for high-quality responses
- **Educational Focus**: All responses are filtered to ensure no direct code solutions are provided
- **Context Management**: Maintains conversation history (last 5 messages)
- **Fallback System**: Provides helpful educational responses if the AI service fails

## API Endpoint

`POST /api/rankbuddy/chat`

**Request Body:**
```json
{
  "message": "User's question",
  "context": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Previous response"}
  ],
  "stream": false
}
```

**Response:**
```json
{
  "response": "AI response text",
  "fallback": false,
  "provider": "openrouter"
}
```

## Features

- ✅ **No Code Solutions**: Responses never contain direct code implementations
- ✅ **Guided Learning**: Focuses on hints, questions, and learning techniques
- ✅ **Conversation Context**: Remembers previous messages in the conversation
- ✅ **Error Handling**: Graceful fallbacks when the AI service is unavailable
- ✅ **Educational Filtering**: Removes any code blocks or inline code from responses

## Previous Implementations Removed

- ❌ Meta AI Python service
- ❌ Replicate API integration
- ❌ Local fallback AI responses

The implementation is now streamlined and uses a single, reliable AI service through OpenRouter.