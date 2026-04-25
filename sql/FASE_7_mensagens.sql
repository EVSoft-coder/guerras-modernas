-- =============================================================
-- FASE 7 — SISTEMA DE MENSAGENS E RELATÓRIOS DE COMBATE
-- =============================================================
-- Executar via phpMyAdmin no servidor

CREATE TABLE IF NOT EXISTS mensagens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    remetente_id BIGINT UNSIGNED NULL,          -- NULL = sistema
    destinatario_id BIGINT UNSIGNED NOT NULL,
    assunto VARCHAR(255) NOT NULL DEFAULT 'Sem Assunto',
    corpo TEXT NOT NULL,
    tipo ENUM('privada', 'relatorio_ataque', 'relatorio_defesa', 'sistema') NOT NULL DEFAULT 'privada',
    lida TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_destinatario (destinatario_id),
    INDEX idx_remetente (remetente_id),
    INDEX idx_tipo (tipo),
    INDEX idx_lida (lida),
    
    FOREIGN KEY (remetente_id) REFERENCES jogadores(id) ON DELETE SET NULL,
    FOREIGN KEY (destinatario_id) REFERENCES jogadores(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserir mensagem de boas-vindas para jogadores existentes
INSERT IGNORE INTO mensagens (remetente_id, destinatario_id, assunto, corpo, tipo)
SELECT NULL, id, 'Bem-vindo, Comandante!', 
    'As suas tropas aguardam ordens. Construa a sua base, treine unidades e conquiste o território inimigo.\n\nDica: Ataque aldeias NPC (bárbaras) para saquear recursos iniciais.\n\n— Comando Central',
    'sistema'
FROM jogadores;
