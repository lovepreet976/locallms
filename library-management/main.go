package main

import (
	"library-management/config"
	"library-management/routes"
	"log"
)

func main() {
	// Initialize the database and handle errors
	db, err := config.ConnectDatabase(false)
	if err != nil {
		log.Fatalf("Database initialization failed: %v", err)
	}

	// Set up the Gin router with the database instance
	r := routes.SetupRouter(db)

	// Start the server on port 8080
	log.Println("Server is running on port 8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
