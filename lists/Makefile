
MAKELIST  = ./bin/makewordlist
TARGETDIR = wordlists
TARGET    = all.json

all:
	$(MAKELIST) *.dir > $(TARGETDIR)/$(TARGET)
	cat $(TARGETDIR)/$(TARGET)

vi:
	vim $(MAKELIST)

vi2:
	vim $(TARGETDIR)/$(TARGET)

