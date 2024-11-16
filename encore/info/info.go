package info

import (
	"context"
)

type Response struct {
	Ticket string
}

//encore:api public method=GET path=/me
func Info(ctx context.Context) (*Response, error) {
	return &Response{Ticket: "D07DY"}, nil
}
