package main

import (
	"backend/db"
	"backend/routes"
	"context"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize MongoDB connection
	db.ConnectDB()

	// Ensure MongoDB disconnects properly on application shutdown
	defer func() {
		if err := db.MongoClient.Disconnect(context.Background()); err != nil {
			log.Fatalf("Error disconnecting from MongoDB: %v", err)
		}
	}()

	// Initialize Gin router
	router := gin.Default()

	// Register routes
	routes.RegisterRoutes(router)

	// Start HTTP server
	log.Println("Server is running on http://localhost:8080")
	log.Fatal(router.Run(":8080"))
}
