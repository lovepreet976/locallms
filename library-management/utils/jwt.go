package utils

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// ✅ Securely define the JWT signing key (Do not expose this in public repositories)
const jwtKey = "your_super_secret_key" // Use an environment variable in production

// ✅ GenerateJWT creates a secure JWT token for authentication
func GenerateJWT(userID uint, role string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"role":    role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(), // Token expires in 1 day
		"iat":     time.Now().Unix(),                     // Issued at time
		"nbf":     time.Now().Unix(),                     // Not valid before now
	}

	// Create a new token with the claims and sign it
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtKey))
}

// ✅ ValidateJWT verifies and extracts claims from a JWT token
func ValidateJWT(tokenString string) (uint, string, error) {
	claims := jwt.MapClaims{}

	// Parse the token with claims
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// Ensure correct signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		return []byte(jwtKey), nil
	})

	// Check if token is valid
	if err != nil || !token.Valid {
		return 0, "", errors.New("invalid or expired token")
	}

	// Extract userID and role
	userIDFloat, ok := claims["user_id"].(float64)
	if !ok {
		return 0, "", errors.New("invalid user_id claim")
	}

	role, ok := claims["role"].(string)
	if !ok {
		return 0, "", errors.New("invalid role claim")
	}

	return uint(userIDFloat), role, nil
}
