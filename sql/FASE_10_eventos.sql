-- ============================================================
-- GUERRAS MODERNAS — FASE 10: EVENTOS MUNDIAIS
-- Executar no phpMyAdmin
-- Data: 2026-04-25
-- ============================================================

-- Inserir um evento de exemplo (Fim de Semana de Produção a dobrar)
-- Este evento pode ser desativado apagando-o ou colocando um 'expira_em' no passado.
INSERT INTO `eventos_mundo` (`titulo`, `descricao`, `tipo`, `dados`, `expira_em`, `created_at`, `updated_at`)
VALUES (
    'Boom Económico Global', 
    'A economia global está em alta. Todas as minas e refinarias produzem 50% mais recursos!', 
    'producao', 
    '{"multiplicador": 1.50}', 
    DATE_ADD(NOW(), INTERVAL 2 DAY), 
    NOW(),
    NOW()
);
