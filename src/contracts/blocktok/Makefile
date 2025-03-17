.PHONY: build test deploy clean

# Solana CLI configuration variables
SOLANA_BIN ?= solana
SOLANA_NETWORK ?= devnet # Can be set to: mainnet-beta, testnet, devnet, localnet
PROGRAM_NAME = blocktok
PROGRAM_DIR = src/contracts/blocktok
PROGRAM_BIN = ./target/deploy/$(PROGRAM_NAME).so
PROGRAM_ID = $(shell $(SOLANA_BIN) address -k target/deploy/$(PROGRAM_NAME)-keypair.json 2>/dev/null || echo "undefined")

# Build the program
build:
	cargo build-bpf --manifest-path $(PROGRAM_DIR)/Cargo.toml

# Run program tests
test:
	cargo test-bpf --manifest-path $(PROGRAM_DIR)/Cargo.toml

# Deploy the program to the selected Solana network
deploy: build
	$(SOLANA_BIN) program deploy --url $(SOLANA_NETWORK) $(PROGRAM_BIN)
	@echo "Deployed program with ID: $(PROGRAM_ID)"

# Clean up build artifacts
clean:
	cargo clean

# Generate and print a new program keypair
new-keypair:
	$(SOLANA_BIN)-keygen new -o target/deploy/$(PROGRAM_NAME)-keypair.json --force
	@echo "Generated new program keypair"
	@echo "Program ID: $(shell $(SOLANA_BIN) address -k target/deploy/$(PROGRAM_NAME)-keypair.json)"

# Get the current program ID
program-id:
	@if [ -f target/deploy/$(PROGRAM_NAME)-keypair.json ]; then \
		echo "Program ID: $(shell $(SOLANA_BIN) address -k target/deploy/$(PROGRAM_NAME)-keypair.json)"; \
	else \
		echo "Program keypair not found. Run 'make new-keypair' to generate one."; \
	fi

# Print help information
help:
	@echo "BlockTok Solana Program Makefile"
	@echo ""
	@echo "Usage:"
	@echo "  make build           - Build the program"
	@echo "  make test            - Run the program tests"
	@echo "  make deploy          - Deploy the program to the selected Solana network"
	@echo "  make clean           - Clean up build artifacts"
	@echo "  make new-keypair     - Generate a new program keypair"
	@echo "  make program-id      - Get the current program ID"
	@echo ""
	@echo "Environment Variables:"
	@echo "  SOLANA_NETWORK       - Solana network to deploy to (default: devnet)"
	@echo "                         Options: mainnet-beta, testnet, devnet, localnet"
	@echo ""
	@echo "Example:"
	@echo "  SOLANA_NETWORK=testnet make deploy" 