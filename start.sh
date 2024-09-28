#! /usr/bin/bash

# start script
echo -e "\e[42m== Start script ==\e[0m"

# install go global packages
echo -e "\e[42m== Install global dependencies for go ==\e[0m"

go install github.com/air-verse/air@latest

echo -e "\e[32mInstall global dependencies for go done\e[0m"


# install dependencies for app-center
echo -e "\e[42m== Install dependencies for app-center ==\e[0m"

cd ./app-center
yarn

echo -e "\e[32mInstall dependencies for app-center done\e[0m"

# install go local packages
echo -e "\e[42m== Install dependencies for go local ==\e[0m"

cd apps/go-backend
go mod download

echo -e "\e[32mInstall dependencies for go local done\e[0m"