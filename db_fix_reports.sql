-- Fix para permitir relatórios de ataques a Redutos Rebeldes (NPCs)
-- NPCs têm jogador_id = NULL, o que causava erro de integridade nos relatórios

ALTER TABLE relatorios MODIFY atacante_id bigint(20) unsigned NULL;
ALTER TABLE relatorios MODIFY defensor_id bigint(20) unsigned NULL;
ALTER TABLE relatorios MODIFY vencedor_id bigint(20) unsigned NULL;

-- Sincronizar bases rebeldes órfãs para o jogador REBELS (ID 7) se existirem
-- UPDATE bases SET jogador_id = 7 WHERE jogador_id IS NULL AND nome LIKE '%Silo%';
