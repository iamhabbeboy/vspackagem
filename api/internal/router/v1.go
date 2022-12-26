package router

import (
	"github.com/gin-gonic/gin"
	"github.com/iamhabbeboy/packagem-backend/internal/handler"
)

func DefineRoute(router *gin.Engine) {
	v1 := router.Group("/v1")
	{
		v1.GET("/search", handler.NewSearchHandler().Find)
	}
}
