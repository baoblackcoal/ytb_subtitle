/**
 * Main entry point for the Next.js Console Calculator application
 * Handles command line arguments and standard input for calculator operations
 */
const readline = require('readline');
const calculator = require('./lib/calculator');
const logger = require('./lib/logger').default;

/**
 * Process a calculation expression and return the result
 * @param expression The arithmetic expression to evaluate
 */
function processExpression(expression: string): void {
  try {
    logger.info(`Processing expression: ${expression}`);
    const result = calculator.evaluateExpression(expression);
    console.log(`Result: ${result}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error processing expression: ${error.message}`);
      console.error(`Error: ${error.message}`);
    } else {
      logger.error('Unknown error occurred');
      console.error('An unknown error occurred');
    }
  }
}

/**
 * Start interactive mode for calculator
 * Reads expressions from standard input
 */
function startInteractiveMode(): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Welcome to Next.js Console Calculator');
  console.log('Enter arithmetic expressions (e.g., "3+5" or "10-4")');
  console.log('Type "exit" or press Ctrl+C to quit');
  
  rl.prompt();

  rl.on('line', (input: string) => {
    const trimmedInput = input.trim();
    
    if (trimmedInput.toLowerCase() === 'exit') {
      console.log('Exiting calculator...');
      rl.close();
      return;
    }
    
    processExpression(trimmedInput);
    rl.prompt();
  });

  rl.on('close', () => {
    console.log('Calculator closed. Goodbye!');
    process.exit(0);
  });
}

// Main execution logic
function main(): void {
  // Check if an expression was provided as a command line argument
  const args: string[] = process.argv.slice(2);
  
  if (args.length > 0) {
    // Use the first argument as the expression
    processExpression(args[0]);
  } else {
    // No arguments provided, start interactive mode
    startInteractiveMode();
  }
}

// Start the application
main();
