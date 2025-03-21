package config

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func TestConnectDatabaseMock(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("Failed to create mock DB: %v", err)
	}
	gormDB, err := gorm.Open(postgres.New(postgres.Config{
		Conn: db,
	}), &gorm.Config{})
	if err != nil {
		t.Fatalf("Failed to open gorm DB: %v", err)
	}

	DB = gormDB

	mock.ExpectBegin()

	mock.ExpectExec("CREATE TABLE").WillReturnResult(sqlmock.NewResult(1, 1)) // Mock CREATE TABLE query

	mock.ExpectCommit()

	DB, err = ConnectDatabase(true)

	assert.NoError(t, err)
	assert.NotNil(t, DB)

}

func TestConnectDatabaseMigrations(t *testing.T) {

	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("Failed to create mock DB: %v", err)
	}

	// initialization using the mock database connection
	gormDB, err := gorm.Open(postgres.New(postgres.Config{
		Conn: db,
	}), &gorm.Config{})
	if err != nil {
		t.Fatalf("Failed to open gorm DB: %v", err)
	}

	// global DB variable
	DB = gormDB

	mock.ExpectBegin()

	mock.ExpectExec("CREATE TABLE").WillReturnResult(sqlmock.NewResult(1, 1))
	// Expect a COMMIT transaction
	mock.ExpectCommit()

	DB, err = ConnectDatabase(true)

	// Assert: Ensure no error occurred and DB is set correctly
	assert.NoError(t, err)
	assert.NotNil(t, DB)

}
