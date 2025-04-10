package routes

import (
	"backend/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func setupCORS(router *gin.Engine) {
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true // Update as needed
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Content-Type"}
	config.AllowCredentials = true

	router.Use(cors.New(config))
}

func RegisterRoutes(router *gin.Engine) {
	setupCORS(router)

	api := router.Group("/api")
	{
		api.POST("/login", handlers.Login)
		api.POST("/subpages", handlers.GetSubpages)
		api.GET("/dashboard-data", handlers.GetDashboardData) // New endpoint
	}
}
