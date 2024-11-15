package info

import (
	"context"
)

type Response struct {
	Message string
}

//encore:api public path=/info/:name
func World(ctx context.Context, name string) (*Response, error) {
	msg := "Hello, " + name + "!"
	return &Response{Message: msg}, nil
}
