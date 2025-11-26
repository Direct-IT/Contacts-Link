<?php
// setup.php
function plugin_version_ctclink() {
    return [
        'name'           => 'Contacts Link',
        'version'        => '0.1.0',
        'author'         => 'Direct-IT',
        'license'        => 'GPLv2+',
        'homepage'       => 'https://www.direct-it.fr',
        'requirements'   => [
            'glpi' => [
                'min' => '10.0.20',
                'max' => '10.0.99'
            ]
	]
    ];
}


define('PLUGIN_CTCLINK_VERSION', '0.1.0');

// Minimal GLPI version, inclusive
define('PLUGIN_CTCLINK_MIN_GLPI', '10.0.20');
// Maximum GLPI version, exclusive
define('PLUGIN_CTCLINK_MAX_GLPI', '10.0.99');

define('PLUGIN_CTCLINK_ROOT', Plugin::getPhpDir('ctclink'));

function plugin_init_ctclink()
{
    /** @var array $PLUGIN_HOOKS */
    global $PLUGIN_HOOKS;

    $PLUGIN_HOOKS['csrf_compliant']['ctclink'] = true;

    /** Declaration ctclink */
    $PLUGIN_HOOKS['add_javascript']['ctclink'] = ['js/mention_contact.js'];
    //$PLUGIN_HOOKS['add_css']['ctclink']        = ['css/mention_contact.css'];
}

