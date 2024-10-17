package input

type parseType struct{}

var ParseRaw parseType

func (parseType) ParseMessageType(raw RawPayload) PayloadType {
	return PayloadType(raw.Type)
}
