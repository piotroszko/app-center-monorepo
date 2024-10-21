package output

import "go-backend/prisma/db"

type OutputUser struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	AvatarUrl string `json:"avatar_url"`
}

func GetOutputUser(user db.UserModel) OutputUser {
	return OutputUser{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
		// AvatarUrl: user.AvatarUrl,
	}
}
