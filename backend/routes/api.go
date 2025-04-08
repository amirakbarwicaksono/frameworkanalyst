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

// func withSSE(c *gin.Context) {
// 	c.Writer.Header().Set("Content-Type", "text/event-stream")
// 	c.Writer.Header().Set("Cache-Control", "no-cache")
// 	c.Writer.Header().Set("Connection", "keep-alive")
// 	c.Next()
// }

func RegisterRoutes(router *gin.Engine) {
	setupCORS(router)

	api := router.Group("/api")
	{
		api.POST("/login", handlers.Login)
		api.POST("/subpages", handlers.GetSubpages)

		// // // Example SSE endpoint (if needed)
		// // api.GET("/events", withSSE(func(c *gin.Context) {
		// 	c.String(200, "data: Hello, SSE!\n\n")
		// }))
	}
}
