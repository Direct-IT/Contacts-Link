<?php
// AJAX contacts CTCLINK - version finale

header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0); // on n'affiche pas d'erreurs PHP en prod
error_reporting(E_ALL);

define('GLPI_ROOT', '../../..');
include(GLPI_ROOT . '/inc/includes.php');

try {
    // Vérifie la session utilisateur
    Session::checkLoginUser();

    // Récupère le terme
    $term = isset($_GET['term']) ? trim($_GET['term']) : '';
    if ($term === '') {
        echo json_encode([]);
        exit;
    }

    // Vérifie que la classe Contact existe
    if (!class_exists('Contact')) {
        echo json_encode([]);
        exit;
    }

    $ct = new Contact();
    $results = [];

    // Recherche par name
    $resName = $ct->find(['name' => ['LIKE', $term.'%']], 'name ASC', 10);
    if ($resName !== false) foreach ($resName as $c) $results[$c['id']] = $c;

    // Recherche par firstname
    $resFirst = $ct->find(['firstname' => ['LIKE', $term.'%']], 'name ASC', 10);
    if ($resFirst !== false) foreach ($resFirst as $c) $results[$c['id']] = $c;

    // Recherche par email
    $resEmail = $ct->find(['email' => ['LIKE', $term.'%']], 'name ASC', 10);
    if ($resEmail !== false) foreach ($resEmail as $c) $results[$c['id']] = $c;

    // Prépare le JSON pour TinyMCE
    $json = [];
    foreach ($results as $c) {
        $json[] = [
            'id'   => $c['id'],
            'text' => $c['name'].' '.$c['firstname'].' ('.$c['email'].')'
        ];
    }

    echo json_encode(array_values($json));

} catch (Throwable $e) {
    echo json_encode([]);
}
