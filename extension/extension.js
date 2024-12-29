const St = imports.gi.St;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Me = imports.misc.extensionUtils.getCurrentExtension();

let panelButton, panelButtonText, refresh_timeout;

function getSettings() {
	let GioSSS = Gio.SettingsSchemaSource;
	let schemaSource = GioSSS.new_from_directory(
		Me.dir.get_child("schemas").get_path(),
		GioSSS.get_default(),
		false);

	let schemaObj = schemaSource.lookup('org.gnome.shell.extensions.ollama-status', true);
	if (!schemaObj) {
		throw new Error('cannot find schemas');
	}
	return new Gio.Settings({ settings_schema : schemaObj });
}

function updateServiceStatus() {
	// check if ollama is running...
	var [ok, out, err, exit] = GLib.spawn_command_line_sync('pgrep ollama');
	panelButtonText.set_style_class_name(
		(out.length > 0) ? 'serviceActive' : 'serviceInactive');
	return true;
}

function init() {
	panelButton = new St.Bin({
		style_class: "panel-button"
	});
	panelButtonText = new St.Label({
		style_class: "serviceInactive",
		text: "ollama"
	});
	panelButton.set_child(panelButtonText);
}

function enable() {
	let settings = getSettings();

	updateServiceStatus();
	timeout = Mainloop.timeout_add_seconds(
		settings.get_double('refresh-interval'),
		updateServiceStatus);

	Main.panel._rightBox.insert_child_at_index(panelButton, 1);
}

function disable() {
	Mainloop.source_remove(timeout);
	Main.panel._rightBox.remove_child(panelButton);
}
