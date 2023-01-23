package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/iamhabbeboy/packagem-backend/internal/service/packages"
)

type SearchHandler struct {
}

type Search struct {
	Q       string `form:"q"`
	Vendor  string `form:"vendor"`
	PerPage int    `form:"per_page,omitempty"`
	Page    int    `form:"page,omitempty"`
}

func NewSearchHandler() *SearchHandler {
	return &SearchHandler{}
}

func (s *SearchHandler) Find(c *gin.Context) {
	var search Search
	if c.ShouldBind(&search) == nil {
		limit := search.PerPage
		if search.PerPage == 0 {
			limit = 20
		}
		data := map[string]interface{}{
			"query":    search.Q,
			"vendor":   search.Vendor,
			"page":     search.Page,
			"per_page": limit,
		}
		resp := packages.NewPackageService(data)
		result, err := resp.GetData()

		if err != nil {
			c.JSON(200, gin.H{
				"status": false,
				"result": resp,
			})
		}

		c.JSON(200, gin.H{
			"status": true,
			"result": result,
		})
	} else {
		c.String(404, "Error occured")
	}
}
