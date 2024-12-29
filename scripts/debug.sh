#!/bin/sh -e

# Starts a new instance of gnome shell reloading the development extension
# https://gjs.guide/extensions/development/debugging.html#running-a-nested-gnome-shell

export G_MESSAGES_DEBUG=all
export MUTTER_DEBUG_DUMMY_MODE_SPECS=1280x720
export SHELL_DEBUG=all

dbus-run-session -- \
	gnome-shell --nested --wayland
