<?php
// Escotilha de emergência para tirar a app de modo de manutenção (503)
// Aceder a mw.evsoft.csmanager.ovh/up.php

$downFile = __DIR__ . '/../storage/framework/down';
$maintenanceFile = __DIR__ . '/../storage/framework/maintenance.php';

$output = "<h1>Operação Lázaro (Desbloqueio de 503)</h1>";

if (file_exists($downFile)) {
    unlink($downFile);
    $output .= "<p style='color: green;'>Ficheiro 'down' apagado. A app deve estar ONLINE.</p>";
} else {
    $output .= "<p style='color: orange;'>Ficheiro 'down' não encontrado.</p>";
}

if (file_exists($maintenanceFile)) {
    unlink($maintenanceFile);
    $output .= "<p style='color: green;'>Ficheiro 'maintenance.php' apagado. A app deve estar ONLINE.</p>";
} else {
    $output .= "<p style='color: orange;'>Ficheiro 'maintenance.php' não encontrado.</p>";
}

echo $output;
