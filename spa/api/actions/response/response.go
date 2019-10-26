package response

type ResponseCode string

type Response struct {
	Code ResponseCode `json:"code"`
	Data interface{}  `json:"data"`
}

const (
	SuccessCode ResponseCode = "SUCCESS"
	ErrorCode   ResponseCode = "ERROR"
)

func Success(data interface{}) *Response {
	return getResponse(SuccessCode, data)
}

func Failure(data interface{}) *Response {
	return getResponse(ErrorCode, data)
}

func getResponse(code ResponseCode, data interface{}) *Response {
	res := new(Response)
	res.Code = code
	res.Data = data
	return res
}
