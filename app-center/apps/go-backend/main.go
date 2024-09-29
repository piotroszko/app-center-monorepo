package main

import (
	"fmt"
	"net/http"

	"go-backend/services/messanger"

	"github.com/lxzan/gws"
)

func main() {
	upgrader := gws.NewUpgrader(&messanger.Handler{}, &gws.ServerOption{
		ParallelEnabled: true,
		Recovery:        gws.Recovery,
	})
	http.HandleFunc("/connect", func(writer http.ResponseWriter, request *http.Request) {
		channel := request.URL.Query().Get("channel")

		writer.Header().Set("Access-Control-Allow-Origin", "*")
		fmt.Println("New connection on channel:", channel)
		socket, err := upgrader.Upgrade(writer, request)

		socket.Session().Store("channel", channel)
		if err != nil {
			return
		}
		go func() {
			socket.ReadLoop()
		}()
	})
	http.ListenAndServe(":4000", nil)
}
