.PHONY: run sqlc migrate-up migrate-down migrate-status test build

DATABASE_URL ?= postgres://formulator:formulator@localhost:5432/formulator?sslmode=disable

run:
	DATABASE_URL=$(DATABASE_URL) go run ./cmd/server

sqlc:
	sqlc generate

migrate-up:
	goose -dir db/migrations postgres "$(DATABASE_URL)" up

migrate-down:
	goose -dir db/migrations postgres "$(DATABASE_URL)" down

migrate-status:
	goose -dir db/migrations postgres "$(DATABASE_URL)" status

test:
	go test ./...

build:
	go build -o bin/server ./cmd/server
