package main

import (
	"log"

	"github.com/shanmugharajk/qanet/actions"
	"github.com/shanmugharajk/qanet/models"
)

func main() {
	defer models.DbConnection.Close()
	app := actions.App()
	if err := app.Serve(); err != nil {
		log.Fatal(err)
	}
}
