#!/bin/sh

export CI=true
export PLAYWRIGHT_BROWSERS_PATH=/usr/bin
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Function to run unit tests
run_unit_tests() {
    echo "Running unit tests..."
    npm run build
    npm test ${@}
}

# Function to run E2E tests
run_e2e_tests() {
    echo "Running E2E tests..."
    # Start the Next.js server in background
    npm run build
    npm start &
    SERVER_PID=$!
    
    # Wait for server to be ready
    echo "Waiting for server to start..."
    sleep 10
    
    # Run E2E tests
    npm run test:e2e ${@}
    E2E_EXIT_CODE=$?
    
    # Kill the server
    kill $SERVER_PID 2>/dev/null
    
    return $E2E_EXIT_CODE
}

# Function to run all tests
run_all_tests() {
    echo "Running all tests..."
    
    # Run unit tests first
    run_unit_tests
    UNIT_EXIT_CODE=$?
    
    if [ $UNIT_EXIT_CODE -ne 0 ]; then
        echo "Unit tests failed, skipping E2E tests"
        return $UNIT_EXIT_CODE
    fi
    
    # Run E2E tests
    run_e2e_tests
    return $?
}

# Parse command line arguments
case "${1}" in
    "unit")
        shift
        run_unit_tests ${@}
        ;;
    "e2e")
        shift
        run_e2e_tests ${@}
        ;;
    "all")
        shift
        run_all_tests ${@}
        ;;
    *)
        # Default: run unit tests (following the original pattern)
        run_unit_tests ${@}
        ;;
esac
