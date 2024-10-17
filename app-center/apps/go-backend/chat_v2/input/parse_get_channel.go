package input

type parseGetChannelType struct{}

var ParseGetChannel parseGetChannelType

func (parseGetChannelType) ParseGetChannelType(raw RawPayload) ChannelGetType {
	return ChannelGetType(raw.GetChannel.Type)
}
