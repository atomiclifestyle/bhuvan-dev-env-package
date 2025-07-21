# Makefile to automate the server and client installation process from a sub-directory.

# Define variables
NODE = node
SERVER_SCRIPT = server.js
INSTALL_SCRIPT = install_package.sh
PID_FILE = .server.pid

# Default target
all: install-client

# Target to install server dependencies inside the 'startup' folder
node_modules: package.json
	@echo "📦 Installing server dependencies inside 'startup' folder..."
	npm install

.PHONY: install
install: node_modules

# Target to start the server from the 'startup' folder
.PHONY: start-server
start-server: install
	@echo "🚀 Starting server..."
	@$(NODE) $(SERVER_SCRIPT) & echo $$! > $(PID_FILE)
	@echo "Server started with PID `cat $(PID_FILE)`."
	@echo "Waiting 2 seconds for server to initialize..."
	@sleep 2

# Target to stop the server
.PHONY: stop-server
stop-server:
	@if [ -f $(PID_FILE) ]; then \
		echo "🛑 Stopping server (PID `cat $(PID_FILE)`)..."; \
		kill `cat $(PID_FILE)`; \
		rm $(PID_FILE); \
	else \
		echo "Server PID file not found. Nothing to stop."; \
	fi

# Main workflow target
# IMPORTANT: This now runs the installation script from the parent (project root) directory.
.PHONY: install-client
install-client: start-server
	@echo "--------------------------------------------------"
	@echo "✅ Server is running. Executing installation script in project root..."
	@(cd ../ && chmod +x startup/$(INSTALL_SCRIPT) && ./startup/$(INSTALL_SCRIPT))
	@echo "--------------------------------------------------"
	@$(MAKE) stop-server

# Target to clean up all generated files
.PHONY: clean
clean:
	@echo "🧹 Cleaning up generated files..."
	# Clean files inside the 'startup' directory
	@rm -rf node_modules package-lock.json $(PID_FILE)
	# Clean files created in the project root directory
	@rm -f ../bhuvan-api.tar.gz ../.env