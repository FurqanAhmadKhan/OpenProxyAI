#!/usr/bin/env node
/**
 * OpenProxyAIFree - JavaScript/Node.js Implementation
 * A reverse API proxy for ChatGPT models using third-party services.
 * 
 * DISCLAIMER: This is for testing purposes only and is not maintained.
 * Last Updated: 3/22/2026 5:00 PM Sunday
 * 
 * Original Website: https://chatgpt-api.vercel.app/
 */

const https = require('https');

/**
 * ChatGPT Proxy Client
 * 
 * Supported Models:
 * - gpt-4o
 * - o3
 * - o4-mini
 * - gpt-4.1
 * - gpt-4.1-mini
 * - gpt-4-turbo
 * - gpt-4
 * - gpt-3.5-turbo
 * - gpt-3.5-turbo-16k
 */
class ChatGPTProxy {
  constructor(timeout = 30000) {
    this.apiUrl = 'https://chatgpt-api.vercel.app/api/chat';
    this.timeout = timeout;
    this.supportedModels = [
      'gpt-4o',
      'o3',
      'o4-mini',
      'gpt-4.1',
      'gpt-4.1-mini',
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k'
    ];
  }

  /**
   * Send a chat message to the specified model
   * @param {string} model - The model to use (e.g., "gpt-3.5-turbo")
   * @param {string|Array} message - User message or array of message objects
   * @param {string} systemPrompt - Optional system prompt to set context
   * @returns {Promise<Object>} The complete API response
   */
  async chat(model, message, systemPrompt = null) {
    if (!this.supportedModels.includes(model)) {
      throw new Error(
        `Model '${model}' is not supported. ` +
        `Supported models: ${this.supportedModels.join(', ')}`
      );
    }

    // Build messages array
    const messages = [];

    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    if (typeof message === 'string') {
      messages.push({
        role: 'user',
        content: message
      });
    } else if (Array.isArray(message)) {
      messages.push(...message);
    } else {
      throw new Error('Message must be a string or array of message objects');
    }

    // Prepare payload
    const payload = {
      model: model,
      messages: messages
    };

    // Make API request
    return this._makeRequest(payload);
  }

  /**
   * Send a simple chat message and return only the response text
   * @param {string} model - The model to use
   * @param {string} message - User message
   * @returns {Promise<string>} The assistant's response text
   */
  async chatSimple(model, message) {
    const response = await this.chat(model, message);
    return this.getResponseText(response);
  }

  /**
   * Extract the text content from an API response
   * @param {Object} response - The API response
   * @returns {string} The assistant's response text
   */
  getResponseText(response) {
    try {
      return response.choices[0].message.content;
    } catch (error) {
      return '';
    }
  }

  /**
   * Extract token usage information from an API response
   * @param {Object} response - The API response
   * @returns {Object} Token usage statistics
   */
  getTokenUsage(response) {
    return response.usage || {};
  }

  /**
   * Make HTTP POST request to the API
   * @private
   */
  _makeRequest(payload) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(payload);
      
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        },
        timeout: this.timeout
      };

      const req = https.request(this.apiUrl, options, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(response);
            } else {
              reject(new Error(`API request failed with status ${res.statusCode}: ${body}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`API request failed: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.write(data);
      req.end();
    });
  }
}

/**
 * Test all supported models with sample queries
 */
async function testAllModels() {
  const proxy = new ChatGPTProxy();
  
  const testCases = [
    ['gpt-4o', 'What is artificial intelligence?'],
    ['o3', 'Explain machine learning in one sentence.'],
    ['o4-mini', 'Write a haiku about coding.'],
    ['gpt-4.1', 'What is the speed of light?'],
    ['gpt-4.1-mini', 'What is 2+2?'],
    ['gpt-4-turbo', 'List 3 programming languages.'],
    ['gpt-4', 'What is Python?'],
    ['gpt-3.5-turbo', 'Hello, how are you?'],
    ['gpt-3.5-turbo-16k', 'Explain the concept of recursion.']
  ];

  console.log('Testing all models...\n');
  console.log('='.repeat(80));

  for (const [model, message] of testCases) {
    console.log(`\nModel: ${model}`);
    console.log(`Query: ${message}`);
    console.log('-'.repeat(80));

    try {
      const response = await proxy.chat(model, message);
      const text = proxy.getResponseText(response);
      const usage = proxy.getTokenUsage(response);

      console.log(`Response: ${text.substring(0, 200)}...`);
      console.log(`Tokens: ${usage.total_tokens || 'N/A'}`);
      console.log('✓ Success');
    } catch (error) {
      console.log(`✗ Error: ${error.message}`);
    }

    console.log('='.repeat(80));
  }
}

/**
 * Main function demonstrating usage examples
 */
async function main() {
  console.log('OpenProxyAIFree - JavaScript/Node.js Client');
  console.log('='.repeat(80));
  console.log('DISCLAIMER: For testing purposes only. Not maintained.');
  console.log('Last Updated: 3/22/2026 5:00 PM Sunday');
  console.log('='.repeat(80));
  console.log();

  // Initialize the proxy
  const proxy = new ChatGPTProxy();

  // Example 1: Simple chat
  console.log('Example 1: Simple Chat');
  console.log('-'.repeat(80));
  try {
    const responseText = await proxy.chatSimple('gpt-3.5-turbo', 'Hello! Tell me a fun fact.');
    console.log(`Response: ${responseText}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
  console.log();

  // Example 2: Chat with full response
  console.log('Example 2: Full Response');
  console.log('-'.repeat(80));
  try {
    const response = await proxy.chat('gpt-3.5-turbo', 'What is Python programming?');
    console.log(`Response Text: ${proxy.getResponseText(response)}`);
    console.log(`Token Usage:`, proxy.getTokenUsage(response));
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
  console.log();

  // Example 3: Chat with system prompt
  console.log('Example 3: Chat with System Prompt');
  console.log('-'.repeat(80));
  try {
    const response = await proxy.chat(
      'gpt-3.5-turbo',
      'Tell me about yourself.',
      'You are a helpful coding assistant specialized in JavaScript.'
    );
    console.log(`Response: ${proxy.getResponseText(response)}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
  console.log();

  // Example 4: Multi-turn conversation
  console.log('Example 4: Multi-turn Conversation');
  console.log('-'.repeat(80));
  try {
    const messages = [
      { role: 'user', content: 'What is JavaScript?' },
      { role: 'assistant', content: 'JavaScript is a programming language.' },
      { role: 'user', content: 'What can I build with it?' }
    ];
    const response = await proxy.chat('gpt-3.5-turbo', messages);
    console.log(`Response: ${proxy.getResponseText(response)}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
  console.log();

  // Example 5: Test different models
  console.log('Example 5: Testing Different Models');
  console.log('-'.repeat(80));
  const modelsToTest = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'];
  const question = 'What is the capital of France?';

  for (const model of modelsToTest) {
    try {
      const responseText = await proxy.chatSimple(model, question);
      console.log(`${model}: ${responseText.substring(0, 100)}...`);
    } catch (error) {
      console.log(`${model}: Error - ${error.message}`);
    }
  }
  console.log();

  // Uncomment to test all models
  // await testAllModels();
}

// Export for use as a module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChatGPTProxy;
}

// Run main function if executed directly
if (require.main === module) {
  main().catch(console.error);
}
