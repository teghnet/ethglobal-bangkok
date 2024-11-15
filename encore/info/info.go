package info

import (
	"context"
)

type Response struct {
	Message string
}

//encore:api public method=GET path=/info/:name
func Info(ctx context.Context, name string) (*Response, error) {
	msg := "Hello, " + name + "!"
	return &Response{Message: msg}, nil
}
