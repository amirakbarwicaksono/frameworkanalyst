package handlers

import (
	"backend/db"
	"backend/models"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// Fungsi untuk login difrontend, berdasarkan databased users.
// LoginRequest represents the incoming login request
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// LoginResponse represents the response for a successful or failed login
type LoginResponse struct {
	Success bool     `json:"success"`
	Message string   `json:"message"`
	Access  []string `json:"access,omitempty"`
	Keyword []string `json:"keyword,omitempty"`
}

func Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse the incoming login request
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Get the MongoDB collection
	collection := db.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Find the user by username
	var user models.User
	err := collection.FindOne(ctx, map[string]string{"username": req.Username}).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	// Verify the password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	// Generate a JWT token (optional)
	// Uncomment if JWT is used for stateless authentication
	// token, err := generateJWT(user)
	// if err != nil {
	// 	http.Error(w, "Failed to generate token", http.StatusInternalServerError)
	// 	return
	// }

	// Return user access and keyword details
	response := LoginResponse{
		Success: true,
		Message: "Login successful",
		Access:  user.Access,
		Keyword: user.Keyword,
		// Token: token, // Uncomment if using JWT
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func GetSubpages(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse the access array from the request body
	var userAccess []string
	if err := json.NewDecoder(r.Body).Decode(&userAccess); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// // Log for debugging
	// fmt.Println("Fetching subpages with access:", userAccess)

	// Get the MongoDB collection
	collection := db.GetCollection("applists")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Filter subpages based on user's access
	filter := map[string]interface{}{
		"nick": map[string]interface{}{
			"$in": userAccess,
		},
	}
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		fmt.Println("Error fetching data:", err) // Debug log
		http.Error(w, "Failed to fetch subpages", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	// Parse results into a slice
	var subpages []map[string]interface{}
	if err := cursor.All(ctx, &subpages); err != nil {
		fmt.Println("Error parsing data:", err) // Debug log
		http.Error(w, "Failed to parse subpages", http.StatusInternalServerError)
		return
	}

	// // Debug log for parsed data
	// fmt.Printf("Fetched subpages: %+v\n", subpages)

	// Send JSON response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(subpages)
}
