package tests

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Global test database variables
var TestDB *gorm.DB
var mock sqlmock.Sqlmock // ✅ Declare `mock` globally
var sqlDB *sql.DB

// ✅ SetupTestDatabase initializes a mock database
func SetupTestDatabase() {
	var err error
	fmt.Println("✅ Setting up TestDB...") // Debugging

	sqlDB, mock, err = sqlmock.New()
	if err != nil {
		log.Fatalf("❌ Failed to create mock database: %v", err)
	}

	fmt.Println("✅ SQL Mock Database Created") // Debugging

	TestDB, err = gorm.Open(postgres.New(postgres.Config{
		Conn: sqlDB,
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})

	if err != nil {
		log.Fatalf("❌ Failed to initialize GORM with mock DB: %v", err)
	}

	fmt.Println("✅ GORM Initialized") // Debugging
}

// ✅ TestMain runs before all tests
func TestMain(m *testing.M) {
	os.Setenv("TEST_MODE", "true") // ✅ Set test mode

	fmt.Println("✅ Setting up test database") // Debugging line
	SetupTestDatabase()                       // ✅ Ensure test DB is initialized

	code := m.Run()

	fmt.Println("✅ Closing test database") // Debugging line
	sqlDB.Close()

	if err := mock.ExpectationsWereMet(); err != nil {
		log.Printf("⚠️ Unmet SQL mock expectations: %v", err)
	}

	os.Exit(code)
}
