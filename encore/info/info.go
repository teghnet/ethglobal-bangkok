package info

import (
	"context"
)

type Response struct {
	Message string
}

//encore:api public method=GET path=/me
func Info(ctx context.Context, name string) (*Response, error) {
	return &Response{Message: "VRX8269"}, nil
}
