package state

type channelType struct{}

var Channel = channelType{}

// TODO: Add cache for checking against already created channels
func (channelType) CreatePrivateChannel(name string, firstUserId string, secondUserId string) error {
	return nil
}
