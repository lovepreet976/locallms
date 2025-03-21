package utils

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// Secret key for signing JWT tokens
var jwtKey = []byte("secret_key")

// GenerateJWT creates a JWT token for a user
func GenerateJWT(userID uint, role string) (string, error) {

	claims := jwt.MapClaims{
		"user_id": userID,
		"role":    role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}

	// Create the token with HS256 signing method
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign and return the token
	signedToken, err := token.SignedString(jwtKey)
	if err != nil {
		// Return a specific error if signing the token fails
		return "", errors.New("failed to sign JWT token")
	}

	return signedToken, nil
}

// ValidateJWT parses and validates a JWT token
func ValidateJWT(tokenString string) (uint, string, error) {

	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	// Check if parsing failed or token is not valid
	if err != nil || !token.Valid {
		return 0, "", errors.New("invalid token")
	}

	// Extract userID from claims
	userIDFloat, ok := claims["user_id"].(float64)
	if !ok {
		return 0, "", errors.New("invalid user_id")
	}

	// Extract role
	role, ok := claims["role"].(string)
	if !ok {
		return 0, "", errors.New("invalid role")
	}

	// Return the user ID and role
	return uint(userIDFloat), role, nil
}
