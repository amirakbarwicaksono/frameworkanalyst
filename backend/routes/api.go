package routes

import (
	"backend/handlers"
	"net/http"
)

// CORS middleware function

func withCORS(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // Update as needed
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		// Allow credentials if required (e.g., cookies, auth tokens)
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		h.ServeHTTP(w, r)
	}
}

// SSE middleware function
func withSSE(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")
		h.ServeHTTP(w, r)
	}
}

// RegisterRoutes registers API routes
func RegisterRoutes() {
	http.HandleFunc("/api/login", withCORS(handlers.Login))                                 //API LOGIN
	http.HandleFunc("/api/subpages", withCORS(handlers.GetSubpages))                        //API SUBPAGE ACCESS
	
}
