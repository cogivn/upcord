import { initializeBot } from './bot-manager';

// Initialize bot when this module is imported
initializeBot().catch(error => {
  console.error('Failed to initialize bot:', error);
});
