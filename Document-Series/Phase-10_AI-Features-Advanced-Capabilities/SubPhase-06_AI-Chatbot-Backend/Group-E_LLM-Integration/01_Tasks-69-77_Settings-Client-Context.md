# Tasks 69-77: Settings, Client, and Context

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 06 - AI Chatbot Backend  
> **Group:** E - LLM Integration  
> **Document:** 01 of 02  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74, 75, 76, 77

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-D_Action-Handlers](../Group-D_Action-Handlers/)
- **→ Next Document:** [02_Tasks-78-82_Service-Formatter-Fallback.md](02_Tasks-78-82_Service-Formatter-Fallback.md)

---

## Document Overview

This document covers the integration of OpenAI GPT into the chatbot system. It establishes the OpenAI configuration settings, creates the client wrapper for API communication, implements the system prompt that defines the chatbot's persona, and builds the context management system that prepares conversation history and business data for the LLM.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create OpenAI Settings | Low | 20 min |
| 70 | Create OPENAI_API_KEY | Low | 10 min |
| 71 | Create OPENAI_MODEL | Low | 10 min |
| 72 | Create OpenAIClient | Medium | 45 min |
| 73 | Create chat_completion Method | Medium | 45 min |
| 74 | Create System Prompt | Medium | 30 min |
| 75 | Create Context Builder | Medium | 45 min |
| 76 | Create add_messages | Low | 20 min |
| 77 | Create add_context | Low | 20 min |

---

## Task 69: Create OpenAI Settings

### Overview
Create the OpenAI settings configuration module that will manage all LLM-related settings for the chatbot. This includes API keys, model selection, temperature settings, token limits, and other OpenAI API parameters. The settings should be environment-aware and support easy configuration changes without code modifications.

### Dependencies
- Task 68: Verify handlers complete
- Django settings structure established
- Environment configuration system in place

### Instructions

1. **Create settings file**
   - Navigate to `backend/config/settings/` directory
   - Create new file named `chatbot.py`
   - This file will contain all chatbot-specific settings

2. **Import required dependencies**
   - Import os module for environment variables
   - Import environ for environment configuration
   - Import any Django settings utilities

3. **Define OpenAI configuration section**
   - Create dedicated section for OpenAI settings
   - Add clear comments explaining each setting
   - Group related settings together

4. **Configure default values**
   - Set reasonable defaults for development
   - Ensure settings work with missing environment variables
   - Add validation for critical settings

5. **Document setting purposes**
   - Add docstrings explaining each setting's role
   - Document expected values and formats
   - Include examples for environment variables

6. **Add setting categories**
   - API Configuration (keys, endpoints)
   - Model Selection (model names, versions)
   - Request Parameters (temperature, tokens)
   - Timeout and Retry settings
   - Feature Flags (enable/disable LLM)

### OpenAI Settings Structure

| Category | Settings | Purpose |
|----------|----------|---------|
| API Config | API Key, Endpoint | Authentication and connection |
| Model Config | Model Name, Version | LLM selection |
| Request Params | Temperature, Max Tokens | Response control |
| Timeouts | Request Timeout, Retry Count | Error handling |
| Features | Enable LLM, Fallback Mode | Feature toggles |

### Setting Validation Requirements

| Setting | Validation | Behavior |
|---------|-----------|----------|
| API Key | Must be present in production | Raise error if missing |
| Model Name | Must be valid OpenAI model | Default to gpt-4 |
| Temperature | Must be 0.0 to 2.0 | Clamp to valid range |
| Max Tokens | Must be positive integer | Default to 500 |
| Timeout | Must be positive number | Default to 30 seconds |

### Environment Variable Mapping

| Environment Variable | Setting Name | Default Value |
|---------------------|--------------|---------------|
| OPENAI_API_KEY | OPENAI_API_KEY | None (required) |
| OPENAI_MODEL | OPENAI_MODEL | "gpt-4" |
| OPENAI_TEMPERATURE | OPENAI_TEMPERATURE | 0.7 |
| OPENAI_MAX_TOKENS | OPENAI_MAX_TOKENS | 500 |
| OPENAI_TIMEOUT | OPENAI_TIMEOUT | 30 |

### Expected Outcome
- Centralized OpenAI settings configuration
- Environment-aware setting management
- Clear documentation for all settings
- Proper defaults for development environment

### Verification Checklist
- [ ] `backend/config/settings/chatbot.py` file created
- [ ] All required settings defined
- [ ] Environment variable mapping configured
- [ ] Default values set appropriately
- [ ] Settings documented with comments
- [ ] Validation rules implemented

---

## Task 70: Create OPENAI_API_KEY

### Overview
Configure the OPENAI_API_KEY setting that stores the authentication credential for OpenAI API access. This setting must securely retrieve the API key from environment variables, validate its presence in production, and provide appropriate error messages when misconfigured.

### Dependencies
- Task 69: Create OpenAI Settings

### Instructions

1. **Define API key setting**
   - Add OPENAI_API_KEY to chatbot settings
   - Use os.environ or env() for retrieval
   - Store as string value

2. **Implement environment retrieval**
   - Read from OPENAI_API_KEY environment variable
   - Do not hardcode any API keys
   - Support .env file configuration

3. **Add validation logic**
   - Check if API key is present
   - Validate key format (starts with "sk-")
   - Provide clear error messages if invalid

4. **Configure environment-specific behavior**
   - Production: Require valid API key
   - Development: Allow None with warning
   - Testing: Use mock key or skip LLM

5. **Add security considerations**
   - Never log the actual API key
   - Mask key in admin interfaces
   - Add to .gitignore if stored in files

6. **Document setup process**
   - Add instructions for obtaining API key
   - Document environment variable setup
   - Include troubleshooting guide

### API Key Format

| Component | Description |
|-----------|-------------|
| Prefix | "sk-" for secret key |
| Length | Approximately 48-51 characters |
| Characters | Alphanumeric and hyphens |
| Example | sk-proj-xxxxxxxxxxxxxxxxxxxxx |

### Environment Configuration

```
Development (.env)
└── OPENAI_API_KEY=sk-proj-devkey123...

Production (Environment Variables)
└── OPENAI_API_KEY=sk-proj-prodkey456...

Testing (.env.test)
└── OPENAI_API_KEY=sk-test-mock123...
```

### Security Best Practices

| Practice | Implementation |
|----------|----------------|
| Never Commit | Add to .gitignore, use env files |
| Rotate Keys | Change keys periodically |
| Least Privilege | Use separate keys per environment |
| Audit Access | Log API key usage (not values) |
| Secure Storage | Use secret management systems |

### Error Handling

| Scenario | Behavior |
|----------|----------|
| Missing in Production | Raise ImproperlyConfigured exception |
| Missing in Development | Log warning, allow None |
| Invalid Format | Raise validation error |
| Expired Key | Catch API error, notify admin |

### Expected Outcome
- Secure API key configuration
- Environment-aware validation
- Clear error messages for misconfigurations
- Proper security practices implemented

### Verification Checklist
- [ ] OPENAI_API_KEY setting defined
- [ ] Environment variable configured
- [ ] Validation logic implemented
- [ ] Security practices followed
- [ ] Documentation added
- [ ] Error handling tested

---

## Task 71: Create OPENAI_MODEL

### Overview
Configure the OPENAI_MODEL setting that specifies which OpenAI language model to use for chat completions. This setting should support multiple model options (GPT-4, GPT-3.5-turbo), allow easy switching between models, and validate that the selected model is available and supported.

### Dependencies
- Task 69: Create OpenAI Settings

### Instructions

1. **Define model setting**
   - Add OPENAI_MODEL to chatbot settings
   - Set default value to "gpt-4"
   - Allow override via environment variable

2. **List supported models**
   - Define list of valid model names
   - Include GPT-4 variants (gpt-4, gpt-4-turbo)
   - Include GPT-3.5 variants (gpt-3.5-turbo)
   - Document capabilities of each model

3. **Implement model validation**
   - Validate selected model is in supported list
   - Provide helpful error if model not found
   - Suggest alternatives if model unavailable

4. **Configure model parameters**
   - Document token limits for each model
   - Define cost implications
   - Note performance characteristics

5. **Add model selection logic**
   - Allow per-tenant model selection (future)
   - Support fallback to cheaper model
   - Enable A/B testing capabilities

6. **Document model selection guide**
   - Explain when to use GPT-4 vs GPT-3.5
   - Document cost vs quality tradeoffs
   - Provide performance benchmarks

### Supported Models

| Model | Context Window | Strengths | Cost |
|-------|---------------|-----------|------|
| gpt-4 | 8,192 tokens | Best quality, reasoning | High |
| gpt-4-turbo | 128,000 tokens | Large context, fast | Medium-High |
| gpt-3.5-turbo | 4,096 tokens | Fast, cost-effective | Low |
| gpt-3.5-turbo-16k | 16,384 tokens | Larger context | Medium-Low |

### Model Selection Criteria

| Use Case | Recommended Model | Reason |
|----------|------------------|---------|
| Complex Queries | gpt-4 | Better reasoning |
| High Volume | gpt-3.5-turbo | Cost effective |
| Large Context | gpt-4-turbo | More tokens |
| Real-time Chat | gpt-3.5-turbo | Lower latency |

### Configuration Options

```
Default Configuration
├── Model: gpt-4
├── Fallback: gpt-3.5-turbo
└── Max Tokens: 500

High-Quality Configuration
├── Model: gpt-4-turbo
├── Fallback: gpt-4
└── Max Tokens: 1000

Cost-Optimized Configuration
├── Model: gpt-3.5-turbo
├── Fallback: gpt-3.5-turbo
└── Max Tokens: 300
```

### Model Parameters

| Parameter | GPT-4 | GPT-3.5-Turbo | Notes |
|-----------|-------|---------------|-------|
| Max Tokens | 8,192 | 4,096 | Input + output |
| Temperature | 0.7 | 0.7 | Default creativity |
| Top P | 1.0 | 1.0 | Nucleus sampling |
| Frequency Penalty | 0.0 | 0.0 | Repetition control |
| Presence Penalty | 0.0 | 0.0 | Topic diversity |

### Expected Outcome
- Configurable model selection
- Support for multiple OpenAI models
- Validation of model availability
- Documentation of model capabilities

### Verification Checklist
- [ ] OPENAI_MODEL setting defined
- [ ] Default model configured
- [ ] Supported models list created
- [ ] Validation logic implemented
- [ ] Model documentation added
- [ ] Environment variable support added

---

## Task 72: Create OpenAIClient

### Overview
Create the OpenAIClient class that wraps the OpenAI Python SDK and provides a clean, tenant-aware interface for making chat completion requests. This client should handle authentication, request formatting, error handling, retry logic, and response parsing.

### Dependencies
- Task 71: Create OPENAI_MODEL
- OpenAI Python SDK installed

### Instructions

1. **Create client file**
   - Navigate to `backend/apps/chatbot/llm/` directory
   - Create new file named `client.py`
   - Initialize client class structure

2. **Import required dependencies**
   - Import OpenAI SDK
   - Import Django settings
   - Import logging utilities
   - Import typing for type hints

3. **Define OpenAIClient class**
   - Create class with singleton or per-request pattern
   - Initialize with API key from settings
   - Configure client options

4. **Implement initialization method**
   - Accept optional API key override
   - Accept optional model override
   - Validate configuration
   - Initialize OpenAI client instance

5. **Add configuration properties**
   - API key (secured, not logged)
   - Model name
   - Default parameters (temperature, max_tokens)
   - Timeout settings

6. **Implement error handling**
   - Catch OpenAI API errors
   - Catch network errors
   - Catch timeout errors
   - Catch rate limit errors
   - Provide meaningful error messages

7. **Add logging and monitoring**
   - Log request initiation (without sensitive data)
   - Log response metadata
   - Log errors with context
   - Track API usage statistics

8. **Implement retry logic**
   - Retry on transient errors
   - Exponential backoff
   - Maximum retry count
   - Circuit breaker pattern

### Client Architecture

```
OpenAIClient
├── Initialization
│   ├── Load API key
│   ├── Configure model
│   └── Set default parameters
├── Configuration
│   ├── API settings
│   ├── Timeout settings
│   └── Retry settings
├── Request Handling
│   ├── Format messages
│   ├── Add parameters
│   └── Send request
└── Error Management
    ├── Catch errors
    ├── Retry logic
    └── Fallback handling
```

### Client Responsibilities

| Responsibility | Implementation |
|----------------|----------------|
| Authentication | Manage API key securely |
| Request Formatting | Convert to OpenAI format |
| Error Handling | Catch and transform errors |
| Retry Logic | Handle transient failures |
| Response Parsing | Extract text from response |
| Logging | Track requests and errors |
| Monitoring | Collect usage metrics |

### Error Types and Handling

| Error Type | Cause | Handling Strategy |
|------------|-------|-------------------|
| APIError | OpenAI service error | Retry with backoff |
| RateLimitError | Too many requests | Queue and retry |
| Timeout | Slow response | Retry once, then fallback |
| AuthenticationError | Invalid API key | Alert admin, no retry |
| InvalidRequestError | Bad request format | Log and fix code |

### Retry Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Max Retries | 3 | Limit retry attempts |
| Initial Delay | 1 second | First retry wait |
| Max Delay | 10 seconds | Maximum wait time |
| Backoff Factor | 2.0 | Exponential increase |

### Logging Strategy

| Event | Log Level | Information |
|-------|-----------|-------------|
| Request Start | INFO | Model, message count |
| Request Success | INFO | Tokens used, duration |
| Request Error | ERROR | Error type, message |
| Retry Attempt | WARNING | Attempt number, delay |
| Rate Limit | WARNING | Retry after time |

### Expected Outcome
- Robust OpenAI client wrapper
- Comprehensive error handling
- Retry logic for transient failures
- Secure credential management
- Request and error logging

### Verification Checklist
- [ ] `backend/apps/chatbot/llm/client.py` file created
- [ ] OpenAIClient class defined
- [ ] Initialization method implemented
- [ ] Error handling configured
- [ ] Retry logic implemented
- [ ] Logging added
- [ ] Type hints included

---

## Task 73: Create chat_completion Method

### Overview
Implement the chat_completion method in the OpenAIClient class that sends formatted messages to the OpenAI API and returns the generated response. This method should handle message formatting, parameter configuration, API communication, response parsing, and comprehensive error handling.

### Dependencies
- Task 72: Create OpenAIClient

### Instructions

1. **Define method signature**
   - Method name: chat_completion
   - Parameters: messages (list), optional kwargs
   - Return type: string (response text)
   - Mark as async if using async OpenAI client

2. **Implement message validation**
   - Validate messages parameter is list
   - Validate each message has role and content
   - Ensure roles are valid (system, user, assistant)
   - Check message content is non-empty

3. **Prepare API request parameters**
   - Set model from client configuration
   - Set temperature from settings or override
   - Set max_tokens from settings or override
   - Add any additional parameters

4. **Make API call**
   - Call OpenAI chat.completions.create
   - Pass formatted messages
   - Pass configuration parameters
   - Handle sync or async execution

5. **Parse API response**
   - Extract completion from response
   - Get message content from choices[0]
   - Handle empty responses
   - Validate response format

6. **Implement error handling**
   - Catch all OpenAI exceptions
   - Transform to application-specific errors
   - Provide context in error messages
   - Log errors with request details

7. **Add response post-processing**
   - Trim whitespace
   - Validate response length
   - Apply any content filters
   - Return cleaned response text

8. **Track usage metrics**
   - Log tokens used (prompt + completion)
   - Track request duration
   - Monitor success/failure rate
   - Store metrics for billing/analysis

### Method Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| messages | List[Dict] | Yes | Conversation messages |
| temperature | float | No | Creativity level (0-2) |
| max_tokens | int | No | Maximum response length |
| top_p | float | No | Nucleus sampling |
| frequency_penalty | float | No | Reduce repetition |
| presence_penalty | float | No | Encourage new topics |

### Message Format

| Field | Type | Required | Example |
|-------|------|----------|---------|
| role | string | Yes | "system", "user", "assistant" |
| content | string | Yes | "What is my order status?" |
| name | string | No | "customer_123" |

### Request Flow

```
1. Validate Input
   └── Check messages format
   └── Validate parameters

2. Prepare Request
   └── Format messages
   └── Add parameters
   └── Set headers

3. Make API Call
   └── Send to OpenAI
   └── Wait for response
   └── Handle timeout

4. Parse Response
   └── Extract text
   └── Validate content
   └── Apply filters

5. Return Result
   └── Clean text
   └── Log metrics
   └── Return to caller
```

### API Request Structure

| Component | Value |
|-----------|-------|
| Model | From OPENAI_MODEL setting |
| Messages | Formatted conversation |
| Temperature | 0.7 (adjustable) |
| Max Tokens | 500 (adjustable) |
| Stream | False (sync response) |

### Response Structure

| Field | Description | Access Path |
|-------|-------------|-------------|
| id | Request ID | response.id |
| object | Response type | response.object |
| created | Timestamp | response.created |
| model | Model used | response.model |
| choices | Response options | response.choices |
| message | Generated message | choices[0].message |
| content | Response text | choices[0].message.content |
| usage | Token counts | response.usage |

### Error Scenarios

| Scenario | Detection | Handling |
|----------|-----------|----------|
| Invalid Messages | Empty or malformed | Raise ValueError |
| API Key Invalid | 401 error | Log and raise |
| Rate Limited | 429 error | Retry with backoff |
| Model Not Found | 404 error | Log and use fallback |
| Timeout | No response | Retry once, then fail |
| Content Filter | Flagged content | Use fallback response |

### Token Usage Tracking

| Metric | Source | Purpose |
|--------|--------|---------|
| Prompt Tokens | response.usage.prompt_tokens | Input cost |
| Completion Tokens | response.usage.completion_tokens | Output cost |
| Total Tokens | response.usage.total_tokens | Total cost |

### Expected Outcome
- Functional chat completion method
- Proper message formatting
- Robust error handling
- Response parsing and validation
- Usage tracking and logging

### Verification Checklist
- [ ] chat_completion method implemented
- [ ] Message validation added
- [ ] API call configured
- [ ] Response parsing implemented
- [ ] Error handling complete
- [ ] Logging and metrics added
- [ ] Method tested with various inputs

---

## Task 74: Create System Prompt

### Overview
Create the system prompt that defines the chatbot's persona, behavior, capabilities, and limitations. This prompt instructs the LLM on how to respond to customer inquiries, what information to provide, what tone to use, and when to escalate to human support.

### Dependencies
- Task 73: Create chat_completion Method

### Instructions

1. **Create prompts file**
   - Navigate to `backend/apps/chatbot/llm/` directory
   - Create new file named `prompts.py`
   - Structure for multiple prompt templates

2. **Define base system prompt template**
   - Create function or constant for system prompt
   - Use f-string or template for dynamic values
   - Accept tenant/store context parameters

3. **Define chatbot persona**
   - Friendly and professional tone
   - Helpful and patient demeanor
   - Store-specific brand voice
   - Cultural sensitivity (Sri Lankan context)

4. **Specify chatbot capabilities**
   - Can answer order status questions
   - Can provide product information
   - Can explain store policies
   - Can help with returns/refunds
   - Can provide shipping information

5. **Define limitations and boundaries**
   - Cannot access customer passwords
   - Cannot process payments directly
   - Cannot modify orders without verification
   - Cannot answer unrelated questions
   - Must escalate complex issues

6. **Add language support instructions**
   - Support English and Sinhala
   - Detect user language from message
   - Respond in same language
   - Translate product names appropriately

7. **Include formatting guidelines**
   - Keep responses concise (under 500 characters)
   - Use proper punctuation
   - Format currency as Rs. (Sri Lankan Rupees)
   - Use bullet points for multiple items
   - Include relevant links when helpful

8. **Add context usage instructions**
   - Explain how to use provided order data
   - Explain how to use product information
   - Instruct to cite specific details
   - Avoid inventing information

9. **Define escalation criteria**
   - When to suggest human support
   - How to transfer gracefully
   - What information to preserve

### System Prompt Structure

| Section | Purpose | Content |
|---------|---------|---------|
| Persona | Define chatbot identity | Role, tone, brand |
| Capabilities | List what bot can do | Features and services |
| Limitations | Define boundaries | What bot cannot do |
| Language | Specify language support | English, Sinhala |
| Formatting | Response style | Length, format, currency |
| Context Usage | How to use data | Orders, products |
| Escalation | When to transfer | Complex issues |

### Persona Definition Template

```
Role
└── Customer service assistant for {store_name}

Tone
├── Friendly and approachable
├── Professional and helpful
└── Patient and understanding

Brand Voice
├── {brand_voice_description}
└── Aligned with store values

Cultural Context
├── Sri Lankan customer base
├── Familiar with local shopping habits
└── Respectful of cultural norms
```

### Capabilities List

| Capability | Description | Example |
|------------|-------------|---------|
| Order Status | Check order progress | "Your order is being packed" |
| Product Info | Provide product details | "This shirt comes in 3 colors" |
| Store Policies | Explain return/refund rules | "Returns within 7 days" |
| Shipping Info | Delivery timeframes | "Ships within 2-3 business days" |
| Account Help | Basic account questions | "Reset password via email" |

### Response Guidelines

| Guideline | Rule | Example |
|-----------|------|---------|
| Length | Max 500 characters | Brief, focused answers |
| Tone | Friendly, professional | "I'd be happy to help with that!" |
| Currency | Rs. format | "Rs. 2,500" |
| Lists | Use bullet points | • Item 1 • Item 2 |
| Links | Include when relevant | "Visit [order page]" |

### Language Support Instructions

| Aspect | Instruction |
|--------|-------------|
| Detection | Detect language from user message |
| Response | Reply in same language as user |
| Translation | Translate product names naturally |
| Mixing | Allow code-switching if natural |
| Default | Default to English if uncertain |

### Context Usage Template

```
When provided with order information:
├── Cite specific order number
├── Reference actual status
├── Use real tracking information
└── Don't invent details

When provided with product information:
├── Reference actual prices
├── Mention real availability
├── Cite actual specifications
└── Don't make assumptions

When information is missing:
├── Ask clarifying questions
├── Don't guess or invent
└── Suggest alternatives
```

### Escalation Criteria

| Scenario | Action | Response Template |
|----------|--------|-------------------|
| Payment Issues | Escalate | "Let me connect you with our payment team" |
| Account Security | Escalate | "For security, I'll transfer you to support" |
| Complex Technical | Escalate | "A specialist can better assist with this" |
| Angry Customer | Escalate | "I'd like to have a manager help you" |
| Policy Exception | Escalate | "Let me check with our team about this" |

### Dynamic Values

| Variable | Source | Example |
|----------|--------|---------|
| {store_name} | Tenant model | "Fashion Hub" |
| {store_url} | Tenant domain | "fashionhub.lk" |
| {support_email} | Store settings | "help@fashionhub.lk" |
| {support_phone} | Store settings | "+94 11 234 5678" |
| {return_policy_days} | Store settings | "7 days" |

### Expected Outcome
- Comprehensive system prompt
- Clear persona definition
- Well-defined capabilities and limitations
- Support for multiple languages
- Dynamic tenant-specific values
- Escalation guidelines

### Verification Checklist
- [ ] `backend/apps/chatbot/llm/prompts.py` file created
- [ ] System prompt template defined
- [ ] Persona clearly described
- [ ] Capabilities listed
- [ ] Limitations specified
- [ ] Language support instructions added
- [ ] Formatting guidelines included
- [ ] Escalation criteria defined
- [ ] Dynamic values supported

---

## Task 75: Create Context Builder

### Overview
Create the ContextBuilder class that prepares the conversation context for the LLM by combining the system prompt, conversation history, and relevant business data (orders, products, customer information). This builder formats all information into the proper message structure required by the OpenAI API.

### Dependencies
- Task 74: Create System Prompt

### Instructions

1. **Create context file**
   - Navigate to `backend/apps/chatbot/llm/` directory
   - Create new file named `context.py`
   - Initialize ContextBuilder class

2. **Define ContextBuilder class**
   - Initialize with tenant context
   - Store system prompt
   - Maintain message list
   - Track context size

3. **Implement initialization method**
   - Accept tenant/store information
   - Load system prompt template
   - Populate dynamic values
   - Initialize empty messages list

4. **Add system prompt method**
   - Format system prompt with tenant data
   - Create system message object
   - Add as first message
   - Ensure only one system message

5. **Create message list structure**
   - Initialize as empty list
   - Follow OpenAI format (role, content)
   - Maintain chronological order
   - Track total token count

6. **Implement helper methods**
   - add_messages: Add conversation history
   - add_context: Add business data context
   - build: Return formatted message list
   - clear: Reset builder state

7. **Add token counting**
   - Estimate tokens for each message
   - Track running total
   - Enforce maximum context length
   - Trim old messages if needed

8. **Implement context prioritization**
   - System prompt: Always included
   - Recent messages: High priority
   - Business data: Medium priority
   - Old messages: Can be trimmed

### Builder Architecture

```
ContextBuilder
├── Initialization
│   ├── Load tenant context
│   ├── Create system prompt
│   └── Initialize messages
├── Message Management
│   ├── Add system prompt
│   ├── Add conversation history
│   └── Add business context
├── Context Optimization
│   ├── Count tokens
│   ├── Prioritize content
│   └── Trim if needed
└── Build
    └── Return formatted messages
```

### Message Structure

| Position | Type | Required | Content |
|----------|------|----------|---------|
| 0 | system | Yes | System prompt with persona |
| 1-N | user/assistant | Yes | Conversation history |
| N+1 | user | Optional | Additional context data |
| Last | user | Yes | Current user message |

### Context Components

| Component | Priority | Max Size | Description |
|-----------|----------|----------|-------------|
| System Prompt | Highest | 500 tokens | Always included |
| Current Message | Highest | 200 tokens | User's latest question |
| Recent History | High | 1000 tokens | Last 10 messages |
| Business Context | Medium | 500 tokens | Order/product data |
| Old History | Low | Trimmed | Older messages |

### Token Budget

| Model | Total Limit | System | History | Context | Response |
|-------|-------------|--------|---------|---------|----------|
| GPT-4 | 8,192 | 500 | 1,000 | 500 | 500 |
| GPT-3.5 | 4,096 | 500 | 800 | 400 | 400 |

### Context Prioritization Strategy

```
1. System Prompt (Always)
   └── Defines chatbot behavior

2. Current Message (Always)
   └── User's immediate question

3. Business Context (High Priority)
   └── Relevant order/product data

4. Recent Messages (High Priority)
   └── Last 5 exchanges

5. Older Messages (Trim if needed)
   └── Keep only if space available
```

### Message Trimming Logic

| Scenario | Action |
|----------|--------|
| Under limit | Include all messages |
| Slightly over | Remove oldest messages |
| Significantly over | Keep only last 5 exchanges |
| Business context large | Prioritize context over old messages |

### Expected Outcome
- Functional context builder
- Proper message formatting
- Token counting and management
- Context prioritization
- Support for business data injection

### Verification Checklist
- [ ] `backend/apps/chatbot/llm/context.py` file created
- [ ] ContextBuilder class defined
- [ ] Initialization method implemented
- [ ] Message list structure created
- [ ] Token counting added
- [ ] Prioritization logic implemented
- [ ] Helper methods created

---

## Task 76: Create add_messages

### Overview
Implement the add_messages method in the ContextBuilder class that adds conversation history to the context. This method retrieves messages from the conversation, formats them in OpenAI format, applies filtering to include only relevant recent messages, and manages token limits.

### Dependencies
- Task 75: Create Context Builder

### Instructions

1. **Define method signature**
   - Method name: add_messages
   - Parameter: conversation (Conversation model)
   - Return type: self (for method chaining)
   - No async required

2. **Retrieve conversation messages**
   - Query Message model for conversation
   - Filter by conversation_id
   - Order by created_at ascending
   - Exclude system messages

3. **Apply message filtering**
   - Limit to last 10 messages
   - Exclude deleted messages
   - Include both user and assistant messages
   - Maintain chronological order

4. **Format messages for OpenAI**
   - Convert to dict format
   - Map sender to role (user/assistant)
   - Extract message text as content
   - Ensure required fields present

5. **Add messages to context**
   - Append to messages list
   - Maintain order (oldest to newest)
   - Estimate tokens for each message
   - Update running token count

6. **Implement token management**
   - Calculate tokens per message
   - Track cumulative count
   - Stop adding if limit approached
   - Prioritize recent messages

7. **Handle edge cases**
   - Empty conversation
   - Very long messages
   - Special characters
   - Null or missing content

### Message Retrieval Query

| Filter | Value | Purpose |
|--------|-------|---------|
| conversation_id | conversation.id | Get messages for this conversation |
| deleted_at | None | Exclude deleted messages |
| order_by | created_at ASC | Chronological order |
| limit | 10 | Recent messages only |

### Message to Role Mapping

| Sender Type | OpenAI Role | Content Source |
|-------------|-------------|----------------|
| user | "user" | message.text |
| bot | "assistant" | message.text |
| system | Excluded | Not added |

### Message Formatting

```
Input (Database)
├── id: 123
├── conversation_id: 456
├── sender: "user"
├── text: "What is my order status?"
└── created_at: 2026-01-31T10:00:00Z

Output (OpenAI Format)
└── {
    "role": "user",
    "content": "What is my order status?"
    }
```

### Token Estimation

| Component | Calculation |
|-----------|-------------|
| Base Tokens | len(content) / 4 |
| Role Overhead | +4 tokens |
| Formatting | +2 tokens |
| Total | base + overhead + formatting |

### Message Limit Strategy

| Scenario | Messages Included | Reasoning |
|----------|------------------|-----------|
| < 5 messages | All messages | Full history available |
| 5-10 messages | Last 10 | Reasonable context |
| > 10 messages | Last 10 | Prevent context overflow |
| Token limit reached | Stop adding | Stay within limits |

### Message Processing Flow

```
1. Query Messages
   └── Get from database
   └── Apply filters

2. Limit Messages
   └── Take last 10
   └── Maintain order

3. Format Messages
   └── Map to OpenAI format
   └── Extract role and content

4. Estimate Tokens
   └── Calculate per message
   └── Track running total

5. Add to Context
   └── Append to messages list
   └── Update token count

6. Return Self
   └── Enable method chaining
```

### Edge Case Handling

| Edge Case | Detection | Handling |
|-----------|-----------|----------|
| No Messages | count == 0 | Return early, no messages added |
| Empty Content | text is None or "" | Skip message |
| Very Long Message | tokens > 500 | Truncate or skip |
| Special Characters | Contains \n, \t | Clean before adding |

### Expected Outcome
- Functional add_messages method
- Proper conversation history retrieval
- Correct message formatting
- Token counting and limits
- Method chaining support

### Verification Checklist
- [ ] add_messages method implemented
- [ ] Message retrieval query created
- [ ] Role mapping implemented
- [ ] Message formatting correct
- [ ] Token estimation added
- [ ] Limit enforcement working
- [ ] Edge cases handled
- [ ] Method returns self

---

## Task 77: Create add_context

### Overview
Implement the add_context method in the ContextBuilder class that adds relevant business context (order details, product information, customer data) to the conversation. This method injects structured data as a formatted message that helps the LLM provide accurate, data-driven responses.

### Dependencies
- Task 76: Create add_messages

### Instructions

1. **Define method signature**
   - Method name: add_context
   - Parameters: entities (dict), data (dict)
   - Return type: self (for method chaining)
   - No async required

2. **Process entities parameter**
   - Extract entity types (order, product, customer)
   - Extract entity IDs
   - Validate entities format
   - Handle missing entities gracefully

3. **Process data parameter**
   - Accept order data dictionary
   - Accept product data dictionary
   - Accept customer data dictionary
   - Validate data format

4. **Format order context**
   - Include order number
   - Include order status
   - Include order items
   - Include tracking information
   - Include order total
   - Format as readable text

5. **Format product context**
   - Include product name
   - Include product price
   - Include product availability
   - Include product description
   - Format as structured text

6. **Format customer context**
   - Include customer name (if relevant)
   - Include order history summary
   - Include loyalty information
   - Respect privacy boundaries

7. **Create context message**
   - Combine all context sections
   - Format as user message
   - Add clear labels for each section
   - Keep concise to save tokens

8. **Add context to messages**
   - Insert after conversation history
   - Before current user message
   - Mark as context (not visible conversation)
   - Estimate and track tokens

9. **Implement context limits**
   - Maximum 500 tokens for context
   - Prioritize most relevant data
   - Truncate long descriptions
   - Omit less important fields if needed

### Entity Types

| Entity Type | Data Included | Format |
|------------|---------------|--------|
| order | Number, status, items, tracking, total | Structured text |
| product | Name, price, stock, description | Structured text |
| customer | Name, order count, loyalty tier | Structured text |

### Context Message Structure

```
Context Information:

Order Details:
- Order Number: ORD-123456
- Status: Shipped
- Items: 2 items
- Total: Rs. 5,500
- Tracking: TRK-789012

Product Details:
- Name: Cotton T-Shirt
- Price: Rs. 2,500
- Stock: In stock
- Color: Blue, Red, White

Customer Information:
- Name: John Doe
- Total Orders: 5
- Loyalty Tier: Gold
```

### Context Formatting Template

| Section | Template | Example |
|---------|----------|---------|
| Order | "Order #{number}: {status}, Total: Rs. {total}" | "Order #ORD-123: Shipped, Rs. 5,500" |
| Product | "{name} - Rs. {price}, {stock}" | "T-Shirt - Rs. 2,500, In stock" |
| Customer | "{name}, {order_count} orders" | "John Doe, 5 orders" |

### Data Priority

| Priority | Data Type | Reasoning |
|----------|-----------|-----------|
| High | Order status | Directly answers common questions |
| High | Order tracking | Frequently requested |
| High | Product price | Essential for purchase decisions |
| Medium | Product description | Helpful but can be long |
| Medium | Customer order count | Provides personalization |
| Low | Product details | Can be truncated if needed |

### Token Budget for Context

| Component | Max Tokens | Truncation Strategy |
|-----------|-----------|---------------------|
| Order Context | 200 | Keep core fields only |
| Product Context | 200 | Shorten description |
| Customer Context | 100 | Omit if space tight |
| Total Context | 500 | Remove lowest priority |

### Context Injection Flow

```
1. Validate Input
   └── Check entities and data

2. Extract Relevant Data
   └── Get order info
   └── Get product info
   └── Get customer info

3. Format Each Section
   └── Order context
   └── Product context
   └── Customer context

4. Combine Sections
   └── Add section headers
   └── Format as readable text

5. Estimate Tokens
   └── Calculate total tokens
   └── Truncate if over limit

6. Add to Messages
   └── Insert as user message
   └── Mark as context
   └── Update token count

7. Return Self
   └── Enable method chaining
```

### Privacy Considerations

| Data Type | Include | Exclude |
|-----------|---------|---------|
| Customer Name | Yes (if relevant) | Sensitive personal info |
| Order Number | Yes | Payment details |
| Order Status | Yes | Credit card numbers |
| Tracking Info | Yes | Passwords |
| Order Total | Yes | Full address |
| Product Info | Yes | Phone numbers (unless needed) |

### Expected Outcome
- Functional add_context method
- Proper data formatting
- Token-efficient context injection
- Privacy-conscious data handling
- Method chaining support

### Verification Checklist
- [ ] add_context method implemented
- [ ] Entity processing added
- [ ] Order context formatting working
- [ ] Product context formatting working
- [ ] Customer context formatting working
- [ ] Token limits enforced
- [ ] Privacy rules followed
- [ ] Method returns self

---

## Summary

This document established the foundation for LLM integration by creating the OpenAI settings configuration, building the OpenAI client wrapper with robust error handling, implementing the system prompt that defines the chatbot's persona, and developing the context builder that prepares conversation history and business data for the LLM.

### Completed Tasks
1. ✓ Created OpenAI settings configuration module
2. ✓ Configured OPENAI_API_KEY with validation
3. ✓ Configured OPENAI_MODEL with options
4. ✓ Created OpenAIClient wrapper class
5. ✓ Implemented chat_completion method
6. ✓ Created comprehensive system prompt
7. ✓ Built ContextBuilder class
8. ✓ Implemented add_messages for history
9. ✓ Implemented add_context for business data

### System Prompt Structure

| Component | Purpose |
|-----------|---------|
| Persona | Defines friendly, professional assistant |
| Capabilities | Lists supported features |
| Limitations | Defines boundaries |
| Language | English and Sinhala support |
| Formatting | Response style guidelines |
| Context Usage | How to use provided data |
| Escalation | When to transfer to humans |

### Context Format

| Message Type | Role | Content |
|--------------|------|---------|
| System Prompt | system | Chatbot persona and instructions |
| Conversation History | user/assistant | Last 10 messages |
| Business Context | user | Order/product data |
| Current Message | user | User's latest question |

### Next Steps
Proceed to [02_Tasks-78-82_Service-Formatter-Fallback.md](02_Tasks-78-82_Service-Formatter-Fallback.md) to create the ChatbotService orchestration, response formatter, fallback handling, and verify the complete LLM integration.
