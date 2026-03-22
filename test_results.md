# API Testing Report

Last tested: March 22, 2026  
Endpoint: `https://chatgpt-api.vercel.app/api/chat`

## Overview

Comprehensive testing was performed on all models documented in the README. Out of 9 models tested, 6 are currently operational while 3 are experiencing timeout issues.

---

## Operational Models

### gpt-3.5-turbo
Response time: Fast  
Backend model: `gpt-3.5-turbo-0125`  
Token usage: 44 tokens (13 prompt, 31 completion)  
Status: Fully functional

### gpt-3.5-turbo-16k
Response time: Fast  
Backend model: `gpt-3.5-turbo-0125`  
Token usage: 97 tokens (16 prompt, 81 completion)  
Status: Fully functional

### gpt-4.1-mini
Response time: Fast  
Backend model: `gpt-4.1-mini-2025-04-14`  
Token usage: 21 tokens (14 prompt, 7 completion)  
Status: Fully functional

### gpt-4.1
Response time: Moderate  
Backend model: `gpt-4.1-2025-04-14`  
Token usage: 471 tokens (13 prompt, 458 completion)  
Status: Fully functional

### gpt-4o
Response time: Moderate  
Backend model: `gpt-4o-2024-08-06`  
Token usage: 362 tokens (13 prompt, 349 completion)  
Status: Fully functional

### o4-mini
Response time: Moderate  
Backend model: `o4-mini-2025-04-16`  
Token usage: 559 tokens (12 prompt, 547 completion)  
Status: Fully functional

---

## Models with Issues

### gpt-4
Error: `FUNCTION_INVOCATION_TIMEOUT`  
The deployment exceeds the maximum execution time limit. This model may be temporarily unavailable or deprecated.

### gpt-4-turbo
Error: `FUNCTION_INVOCATION_TIMEOUT`  
The deployment exceeds the maximum execution time limit. This model may be temporarily unavailable or deprecated.

### o3
Error: `FUNCTION_INVOCATION_TIMEOUT`  
The deployment exceeds the maximum execution time limit. This model may be temporarily unavailable or deprecated.

---

## Technical Notes

All operational models return responses in standard OpenAI chat completion format with proper JSON structure including:
- Unique completion IDs
- Token usage statistics
- Finish reason indicators
- Service tier information

The timeout errors appear to be infrastructure-related rather than API issues. These models may become available again in future deployments or could be phased out entirely.

---

## Testing Methodology

Each model was tested with a unique prompt appropriate to its capabilities. Requests were sent via POST to the API endpoint with proper JSON formatting and Content-Type headers. Response times and token counts were recorded for successful completions.
