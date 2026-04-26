<?php

namespace App\Services;

use App\Models\General;
use App\Models\GeneralSkill;

class GeneralService
{
    /**
     * Lista de habilidades disponíveis para o General.
     */
    public function getAvailableSkills()
    {
        return [
            'logistica' => [
                'nome' => 'Logística Avançada',
                'descricao' => 'Aumenta a velocidade de marcha das tropas.',
                'bonus' => 5, // 5% por nível
                'max_nivel' => 5,
            ],
            'ofensiva' => [
                'nome' => 'Doutrina Ofensiva',
                'descricao' => 'Aumenta o poder de ataque de todas as unidades.',
                'bonus' => 3, // 3% por nível
                'max_nivel' => 10,
            ],
            'defensiva' => [
                'nome' => 'Estratégia de Fortificação',
                'descricao' => 'Aumenta a defesa das tropas em bases aliadas.',
                'bonus' => 4, // 4% por nível
                'max_nivel' => 10,
            ],
            'saque' => [
                'nome' => 'Operações de Saque',
                'descricao' => 'Aumenta a capacidade de carga das tropas.',
                'bonus' => 10, // 10% por nível
                'max_nivel' => 5,
            ],
            'recrutamento' => [
                'nome' => 'Treino Acelerado',
                'descricao' => 'Reduz o tempo de recrutamento de unidades.',
                'bonus' => 2, // 2% por nível
                'max_nivel' => 10,
            ],
        ];
    }

    /**
     * Adiciona experiência ao General e processa level up.
     */
    public function addExperience(General $general, int $xp)
    {
        $general->experiencia += $xp;
        
        $xpNecessario = $this->getXpForNextLevel($general->nivel);
        
        while ($general->experiencia >= $xpNecessario) {
            $general->experiencia -= $xpNecessario;
            $general->nivel++;
            $general->pontos_skill += 2; // 2 pontos por nível
            $xpNecessario = $this->getXpForNextLevel($general->nivel);
        }
        
        $general->save();
    }

    public function getXpForNextLevel(int $currentLevel)
    {
        return floor(100 * pow(1.5, $currentLevel - 1));
    }

    /**
     * Aplica uma skill ao general.
     */
    public function upgradeSkill(General $general, string $skillSlug)
    {
        $skillsDisponiveis = $this->getAvailableSkills();
        if (!isset($skillsDisponiveis[$skillSlug])) return false;
        if ($general->pontos_skill <= 0) return false;

        $skill = $general->skills()->firstOrCreate(['skill_slug' => $skillSlug]);
        
        if ($skill->nivel >= $skillsDisponiveis[$skillSlug]['max_nivel']) return false;

        $skill->nivel++;
        $skill->save();

        $general->pontos_skill--;
        $general->save();

        return true;
    }
}
