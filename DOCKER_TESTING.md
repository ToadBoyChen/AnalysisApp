# Docker Testing Guide for 3Z-Analysis

This guide explains how to run all tests in a containerized Docker environment, following the standards from [docker-ts-npm-vite](https://github.com/aidt001/docker-ts-npm-vite).

## 🐳 Docker Setup

### Prerequisites

- Docker installed and running
- No need to install Node.js or dependencies locally

#### Docker Setup on Arch Linux

```bash
# Install Docker
sudo pacman -S docker

# Start Docker service
sudo systemctl start docker

# Enable Docker to start on boot
sudo systemctl enable docker

# Add your user to docker group (logout/login required)
sudo usermod -aG docker $USER

# Verify Docker is running
docker --version
docker info
```

#### Alternative: Docker Desktop
If you prefer a GUI, install Docker Desktop from AUR:
```bash
yay -S docker-desktop
```

### Quick Start

1. **Build the Docker image:**
   ```bash
   ./build_docker.sh 3z-analysis
   ```

2. **Run all tests:**
   ```bash
   docker run -t 3z-analysis ./run_tests.sh all
   ```

## 📋 Available Test Commands

### Build Docker Image

```bash
# Build with default name
./build_docker.sh

# Build with custom name
./build_docker.sh my-trading-app

# Build for specific platform
./build_docker.sh 3z-analysis linux/arm64
```

### Run Tests in Docker

#### Unit Tests Only (Default)
```bash
# Run Jest unit tests
docker run -t 3z-analysis ./run_tests.sh

# Run specific unit test
docker run -t 3z-analysis ./run_tests.sh unit button
```

#### E2E Tests Only
```bash
# Run all Playwright E2E tests
docker run -t 3z-analysis ./run_tests.sh e2e

# Run specific E2E test file
docker run -t 3z-analysis ./run_tests.sh e2e landing-page.spec.ts
```

#### All Tests
```bash
# Run both unit and E2E tests
docker run -t 3z-analysis ./run_tests.sh all
```

## 🔧 Docker Configuration

### Dockerfile Features

- **Base Image**: `node:22.14.0-alpine3.21` (same as reference repo)
- **Playwright Support**: System Chromium installation for E2E tests
- **Optimized Layers**: Separate dependency installation for better caching
- **Security**: Runs with appropriate browser security flags

### .dockerignore

Follows the same pattern as the reference repository:
- Excludes everything by default (`*`)
- Explicitly includes only necessary files
- Optimizes build context size

### Browser Configuration

In Docker environment:
- **Chromium Only**: Runs only Chromium tests for faster execution
- **System Browser**: Uses Alpine's Chromium package
- **Headless Mode**: Automatically runs in headless mode
- **Security Flags**: Includes `--no-sandbox` and other Docker-safe flags

## 📊 Test Execution Flow

### Unit Tests (`./run_tests.sh` or `./run_tests.sh unit`)
1. Set CI environment variables
2. Build the Next.js application
3. Run Jest tests with coverage
4. Exit with test results

### E2E Tests (`./run_tests.sh e2e`)
1. Set CI and Playwright environment variables
2. Build the Next.js application
3. Start Next.js server in background
4. Wait for server to be ready (10 seconds)
5. Run Playwright tests against localhost:3000
6. Kill server and return results

### All Tests (`./run_tests.sh all`)
1. Run unit tests first
2. If unit tests pass, run E2E tests
3. If unit tests fail, skip E2E tests
4. Return combined results

## 🚀 Example Usage

### Complete Test Suite
```bash
# Build and test everything
./build_docker.sh 3z-analysis
docker run -t 3z-analysis ./run_tests.sh all
```

### Development Workflow
```bash
# Build once
./build_docker.sh 3z-analysis

# Run unit tests during development
docker run -t 3z-analysis ./run_tests.sh unit

# Run E2E tests before deployment
docker run -t 3z-analysis ./run_tests.sh e2e
```

### CI/CD Pipeline
```bash
# In your CI/CD script
./build_docker.sh trading-platform-${BUILD_NUMBER}
docker run -t trading-platform-${BUILD_NUMBER} ./run_tests.sh all
```

## 🔍 Debugging in Docker

### Interactive Shell
```bash
# Get shell access to debug
docker run -it 3z-analysis sh

# Inside container, you can run:
npm test
npm run test:e2e
npm run build
```

### View Logs
```bash
# Run with verbose output
docker run -t 3z-analysis ./run_tests.sh unit --verbose

# Check build logs
docker build --no-cache -t 3z-analysis .
```

### Mount Local Files for Development
```bash
# Mount source code for live development
docker run -v .:/app -it 3z-analysis sh
```

## 📈 Performance Optimizations

### Docker Layer Caching
- Dependencies installed in separate layer
- Only rebuilds when package.json changes
- Source code changes don't require dependency reinstall

### Test Execution
- **Unit Tests**: Fast execution (~30 seconds)
- **E2E Tests**: Optimized for CI with single browser
- **Parallel Execution**: Disabled in CI for stability

### Resource Usage
- **Memory**: ~512MB for unit tests, ~1GB for E2E tests
- **CPU**: Single core sufficient for CI environment
- **Storage**: ~200MB image size

## 🔒 Security Considerations

### Browser Security
- Runs with `--no-sandbox` flag (required for Docker)
- Uses `--disable-setuid-sandbox` for Alpine Linux
- Includes `--disable-dev-shm-usage` for memory optimization

### Container Security
- Non-root user execution (inherited from Node.js base image)
- Minimal attack surface with Alpine Linux
- No unnecessary packages installed

## 🌐 CI/CD Integration

### GitHub Actions Example
```yaml
name: Docker Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: ./build_docker.sh 3z-analysis
      
      - name: Run all tests
        run: docker run -t 3z-analysis ./run_tests.sh all
      
      - name: Cleanup
        run: docker rmi 3z-analysis
```

### GitLab CI Example
```yaml
test:
  stage: test
  script:
    - ./build_docker.sh 3z-analysis
    - docker run -t 3z-analysis ./run_tests.sh all
  after_script:
    - docker rmi 3z-analysis
```

## 🛠️ Troubleshooting

### Common Issues

1. **Permission Denied on Scripts**
   ```bash
   chmod +x build_docker.sh run_tests.sh
   ```

2. **Docker Build Fails**
   ```bash
   # Clear Docker cache
   docker system prune -f
   docker build --no-cache -t 3z-analysis .
   ```

3. **E2E Tests Timeout**
   ```bash
   # Increase server wait time in run_tests.sh
   # Change: sleep 10
   # To: sleep 20
   ```

4. **Browser Launch Fails**
   ```bash
   # Check Chromium installation
   docker run -it 3z-analysis chromium-browser --version
   ```

### Environment Variables

Available in Docker container:
- `CI=true` - Enables CI mode for all tools
- `PLAYWRIGHT_BROWSERS_PATH=/usr/bin` - System browser path
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser` - Chromium path

## 📚 Comparison with Reference Repository

| Feature | Reference Repo | 3Z-Analysis | Notes |
|---------|---------------|-------------|-------|
| Base Image | ✅ node:22.14.0-alpine3.21 | ✅ Same | Consistent base |
| Build Script | ✅ build_docker.sh | ✅ Same pattern | Platform support |
| Test Script | ✅ run_tests.sh | ✅ Enhanced | Added E2E support |
| .dockerignore | ✅ Whitelist pattern | ✅ Same pattern | Optimized context |
| CI Integration | ✅ CI=true | ✅ Enhanced | Better E2E support |

## 🎯 Best Practices

1. **Build Once, Test Multiple**: Build image once, run different test suites
2. **Layer Optimization**: Keep dependencies separate from source code
3. **Resource Limits**: Set appropriate memory/CPU limits in production
4. **Cleanup**: Remove images after CI runs to save space
5. **Caching**: Use Docker layer caching in CI/CD pipelines

This Docker setup ensures your tests run consistently across all environments while following established patterns and best practices! 🚀
