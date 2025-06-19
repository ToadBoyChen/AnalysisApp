#!/usr/bin/env node

/**
 * Test Runner Script for 3Z-Analysis
 * 
 * This script provides a convenient way to run different types of tests
 * and generate reports for the 3Z-Analysis trading platform.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n${description}`, 'cyan');
  log(`Running: ${command}`, 'yellow');
  
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed successfully`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed`, 'red');
    return false;
  }
}

function displayHelp() {
  log('\n3Z-Analysis Test Runner', 'bright');
  log('========================', 'bright');
  log('\nUsage: node test-runner.js [command]', 'cyan');
  log('\nAvailable commands:', 'yellow');
  log('  all          - Run all tests', 'green');
  log('  unit         - Run unit tests only', 'green');
  log('  components   - Run component tests only', 'green');
  log('  utils        - Run utility function tests only', 'green');
  log('  watch        - Run tests in watch mode', 'green');
  log('  coverage     - Generate coverage report', 'green');
  log('  install      - Install test dependencies', 'green');
  log('  setup        - Setup test environment', 'green');
  log('  help         - Show this help message', 'green');
  log('\nExamples:', 'yellow');
  log('  node test-runner.js all', 'cyan');
  log('  node test-runner.js components', 'cyan');
  log('  node test-runner.js coverage', 'cyan');
}

function checkDependencies() {
  log('\nChecking test dependencies...', 'cyan');
  
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ package.json not found', 'red');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredDeps = [
    '@testing-library/react',
    '@testing-library/jest-dom',
    '@testing-library/user-event',
    'jest',
    'jest-environment-jsdom'
  ];
  
  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.devDependencies || !packageJson.devDependencies[dep]
  );
  
  if (missingDeps.length > 0) {
    log(`❌ Missing dependencies: ${missingDeps.join(', ')}`, 'red');
    log('Run: node test-runner.js install', 'yellow');
    return false;
  }
  
  log('✅ All test dependencies are installed', 'green');
  return true;
}

function installDependencies() {
  log('\nInstalling test dependencies...', 'cyan');
  
  const installCommand = 'npm install';
  return runCommand(installCommand, 'Installing dependencies');
}

function setupTestEnvironment() {
  log('\nSetting up test environment...', 'cyan');
  
  // Check if test files exist
  const testFiles = [
    'jest.config.js',
    'jest.setup.js',
    '__tests__'
  ];
  
  const missingFiles = testFiles.filter(file => 
    !fs.existsSync(path.join(__dirname, file))
  );
  
  if (missingFiles.length > 0) {
    log(`❌ Missing test files: ${missingFiles.join(', ')}`, 'red');
    log('Please ensure all test configuration files are present', 'yellow');
    return false;
  }
  
  log('✅ Test environment is properly configured', 'green');
  return true;
}

function runAllTests() {
  log('\nRunning all tests...', 'cyan');
  return runCommand('npm test', 'All tests');
}

function runUnitTests() {
  log('\nRunning unit tests...', 'cyan');
  return runCommand('npm test -- --testPathPattern="__tests__"', 'Unit tests');
}

function runComponentTests() {
  log('\nRunning component tests...', 'cyan');
  return runCommand('npm test -- --testPathPattern="Components/"', 'Component tests');
}

function runUtilTests() {
  log('\nRunning utility tests...', 'cyan');
  return runCommand('npm test -- --testPathPattern="lib/"', 'Utility tests');
}

function runWatchMode() {
  log('\nStarting test watch mode...', 'cyan');
  log('Press Ctrl+C to exit watch mode', 'yellow');
  return runCommand('npm run test:watch', 'Test watch mode');
}

function generateCoverage() {
  log('\nGenerating coverage report...', 'cyan');
  const success = runCommand('npm run test:coverage', 'Coverage report generation');
  
  if (success) {
    log('\n📊 Coverage report generated!', 'green');
    log('Open coverage/lcov-report/index.html to view the report', 'cyan');
  }
  
  return success;
}

function displayTestSummary() {
  log('\n📋 Test Summary', 'bright');
  log('===============', 'bright');
  
  const testDir = path.join(__dirname, '__tests__');
  if (!fs.existsSync(testDir)) {
    log('❌ Test directory not found', 'red');
    return;
  }
  
  function countTestFiles(dir) {
    let count = 0;
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        count += countTestFiles(filePath);
      } else if (file.endsWith('.test.ts') || file.endsWith('.test.tsx')) {
        count++;
      }
    }
    
    return count;
  }
  
  const testFileCount = countTestFiles(testDir);
  log(`📁 Test files: ${testFileCount}`, 'cyan');
  
  // List test categories
  const categories = [
    { name: 'Utility Tests', path: 'lib' },
    { name: 'Component Tests', path: 'Components' },
    { name: 'Page Tests', path: 'app' }
  ];
  
  categories.forEach(category => {
    const categoryPath = path.join(testDir, category.path);
    if (fs.existsSync(categoryPath)) {
      const count = countTestFiles(categoryPath);
      log(`  ${category.name}: ${count} files`, 'green');
    }
  });
}

// Main execution
function main() {
  const command = process.argv[2] || 'help';
  
  log('🧪 3Z-Analysis Test Runner', 'bright');
  log('==========================', 'bright');
  
  switch (command.toLowerCase()) {
    case 'all':
      if (checkDependencies() && setupTestEnvironment()) {
        runAllTests();
        displayTestSummary();
      }
      break;
      
    case 'unit':
      if (checkDependencies() && setupTestEnvironment()) {
        runUnitTests();
      }
      break;
      
    case 'components':
      if (checkDependencies() && setupTestEnvironment()) {
        runComponentTests();
      }
      break;
      
    case 'utils':
      if (checkDependencies() && setupTestEnvironment()) {
        runUtilTests();
      }
      break;
      
    case 'watch':
      if (checkDependencies() && setupTestEnvironment()) {
        runWatchMode();
      }
      break;
      
    case 'coverage':
      if (checkDependencies() && setupTestEnvironment()) {
        generateCoverage();
      }
      break;
      
    case 'install':
      installDependencies();
      break;
      
    case 'setup':
      setupTestEnvironment();
      break;
      
    case 'summary':
      displayTestSummary();
      break;
      
    case 'help':
    default:
      displayHelp();
      break;
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  runAllTests,
  runComponentTests,
  runUtilTests,
  generateCoverage,
  checkDependencies,
  installDependencies
};
