package tests

import (
	"library-management/utils"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
)

// ✅ Test JWT Token Generation
func TestJWTGeneration(t *testing.T) {
	token, err := utils.GenerateJWT(1, "admin")
	assert.NoError(t, err)
	assert.NotEmpty(t, token)
}

// TestJWTValidation ensures tokens are correctly validated
func TestJWTValidation(t *testing.T) {
	token, err := utils.GenerateJWT(1, "user")
	assert.NoError(t, err)

	userID, role, err := utils.ValidateJWT(token)
	assert.NoError(t, err)
	assert.Equal(t, uint(1), userID)
	assert.Equal(t, "user", role)
}

// ✅ Test JWT Expiration Handling
func TestJWTExpiration(t *testing.T) {
	expiredClaims := jwt.MapClaims{
		"user_id": 2,
		"role":    "user",
		"exp":     time.Now().Add(-time.Hour).Unix(), // ❌ Expired 1 hour ago
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, expiredClaims)
	expiredToken, _ := token.SignedString([]byte("your_super_secret_key")) // ⚠ Hardcoded for test

	_, _, err := utils.ValidateJWT(expiredToken)
	assert.Error(t, err, "Expired token should return an error")
}

// ✅ Test Invalid JWT Token
func TestInvalidJWT(t *testing.T) {
	_, _, err := utils.ValidateJWT("invalid.token.here")
	assert.Error(t, err, "Invalid token should return an error")
}

// ✅ Test JWT with Wrong Signature
func TestJWTWrongSignature(t *testing.T) {
	token, err := utils.GenerateJWT(3, "admin")
	assert.NoError(t, err)

	// Manually tamper with the token
	tamperedToken := token + "tampered"

	_, _, err = utils.ValidateJWT(tamperedToken)
	assert.Error(t, err, "Tampered token should be invalid")
}
