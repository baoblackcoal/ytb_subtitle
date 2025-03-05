# Next.js Console Calculator

A simple console-based calculator application built with Next.js and TypeScript.

## Features

- Basic arithmetic operations (addition, subtraction)
- Command-line interface
- Interactive mode for continuous calculations
- Comprehensive error handling
- Extensive test coverage

## Project Structure

```
/calculator-app
├── /lib               // Core calculator logic
│   ├── calculator.ts  // Calculator operations
│   └── logger.ts      // Logging functionality
├── /tests             // Test files
│   └── calculator.test.ts // Tests for calculator module
├── app.ts             // Application entry point
├── package.json       // Project dependencies
├── tsconfig.json      // TypeScript configuration
├── jest.config.js     // Jest test configuration
└── README.md          // Project documentation
```

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- Yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
yarn install
```

### Running the Application

You can run the calculator in two modes:

1. **Command-line mode** - Pass an expression as an argument:

```bash
yarn start "3+5"
```

2. **Interactive mode** - Start the calculator without arguments:

```bash
yarn start
```

In interactive mode, you can enter expressions one at a time. Type `exit` or press Ctrl+C to quit.

### Running Tests

Run all tests:

```bash
yarn test
```

Run tests in watch mode:

```bash
yarn test:watch
```

## Supported Operations

- Addition: `a+b`
- Subtraction: `a-b`

## Error Handling

The calculator handles various error cases:
- Empty expressions
- Invalid expression formats
- Non-numeric inputs
- Invalid operation formats

## Future Enhancements

- Support for multiplication and division operations
- Support for more complex expressions with parentheses
- Web API interface for HTTP-based calculations
- Enhanced logging and monitoring
