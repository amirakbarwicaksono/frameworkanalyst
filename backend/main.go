package main

import (
	"backend/db"
	"backend/routes"
	"context"
	"log"
	"net/http"
)

func main() {
	// Initialize MongoDB connection
	db.ConnectDB()

	//Ensure all necessary indexes
	//handlers.EnsureIndexes()

	// Ensure MongoDB disconnects properly on application shutdown
	defer func() {
		if err := db.MongoClient.Disconnect(context.Background()); err != nil {
			log.Fatalf("Error disconnecting from MongoDB: %v", err)
		}
	}()

	// Register routes
	routes.RegisterRoutes()

	// Start HTTP server
	log.Println("Server is running on http://localhost:8080")
	log.Fatal(http.ListenAndServe("0.0.0.0:8080", nil))
}

func EnsureIndexes() {
	panic("unimplemented")
}
