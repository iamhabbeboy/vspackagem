package main

import (
	"github.com/gin-gonic/gin"
	"github.com/iamhabbeboy/packagem-backend/internal/router"
)

func main() {
	r := gin.Default()
	router.UseCors(r)
	router.DefineRoute(r)
	r.Run(":9200")
}
