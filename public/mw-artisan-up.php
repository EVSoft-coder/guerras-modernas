<?php
/**
 * Script para desativar o modo de manutenção (php artisan up manual)
 */

$downFile = __DIR__ . '/../storage/framework/down';

if (file_exists($downFile)) {
    if (unlink($downFile)) {
        echo "<h1 style='color:green'>MODO MANUTENÇÃO DESATIVADO!</h1>";
        echo "<p>O ficheiro 'storage/framework/down' foi removido com sucesso.</p>";
        echo "<a href='/dashboard'>VOLTAR AO COMANDO</a>";
    } else {
        echo "<h1 style='color:red'>ERRO AO REMOVER!</h1>";
        echo "<p>Verifique as permissões da pasta storage/framework.</p>";
    }
} else {
    echo "<h1>O SITE JÁ ESTÁ ATIVO!</h1>";
    echo "<p>Ficheiro 'down' não encontrado.</p>";
    echo "<a href='/dashboard'>IR PARA O DASHBOARD</a>";
}
