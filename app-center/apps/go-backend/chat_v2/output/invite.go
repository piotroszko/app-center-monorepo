package output

type OutputInvite struct {
	ID      int           `json:"id"`
	Channel OutputChannel `json:"channel"`
	User    OutputUser    `json:"user"`
	Data    string        `json:"data"`
}
