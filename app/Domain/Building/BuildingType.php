<?php
 
namespace App\Domain\Building;
 
class BuildingType
{
    const QG = 'qg';
    const MURALHA = 'muralha';
    const MINA_SUPRIMENTOS = 'mina_suprimentos';
    const REFINARIA = 'refinaria';
    const FABRICA_MUNICOES = 'fabrica_municoes';
    const POSTO_RECRUTAMENTO = 'posto_recrutamento';
    const QUARTEL = 'quartel';
    const AERODROMO = 'aerodromo';
    const RADAR_ESTRATEGICO = 'radar_estrategico';
    const CENTRO_PESQUISA = 'centro_pesquisa';
    const PARLAMENTO = 'parlamento';
    const FACTORY = 'factory';
    const SOLAR = 'solar';
    const MINA_METAL = 'factory'; 
    const CENTRAL_ENERGIA = 'solar';
    const COMPLEXO_RESIDENCIAL = 'complexo_residencial';
 
    /**
     * Aliases para compatibilidade com nomes legados ou front-end.
     */
    public static function normalize(string $type): string
    {
        $map = [
            'qg' => self::QG,
            'centrocomando' => self::QG,
            'muralha' => self::MURALHA,
            'perimetro' => self::MURALHA,
            'arsenal' => self::FABRICA_MUNICOES,
            'fabrica_municoes' => self::FABRICA_MUNICOES,
            'mina_suprimentos' => self::MINA_SUPRIMENTOS,
            'mina' => self::MINA_SUPRIMENTOS,
            'parlamento' => self::PARLAMENTO,
            'refinaria' => self::REFINARIA,
            'aerodromo' => self::AERODROMO,
            'heliponto' => self::AERODROMO,
            'posto_recrutamento' => self::POSTO_RECRUTAMENTO,
            'quartel' => self::QUARTEL,
            'radar' => self::RADAR_ESTRATEGICO,
            'centro_pesquisa' => self::CENTRO_PESQUISA,
            'factory' => self::FACTORY,
            'fabrica' => self::FACTORY,
            'solar' => self::SOLAR,
            'planta_solar' => self::SOLAR,
            'minametal' => self::FACTORY,
            'mina_metal' => self::FACTORY,
            'centralenergia' => self::SOLAR,
            'central_energia' => self::SOLAR,
            'complexo_residencial' => self::COMPLEXO_RESIDENCIAL,
            'habitacao' => self::COMPLEXO_RESIDENCIAL,
        ];
 
        $cleaned = strtolower(str_replace([' ', '_', '-'], '', $type));
        return $map[$cleaned] ?? $type;
    }
 
    public static function all(): array
    {
        return [
            self::QG, self::MURALHA, self::MINA_SUPRIMENTOS, self::REFINARIA,
            self::FABRICA_MUNICOES, self::POSTO_RECRUTAMENTO, self::QUARTEL,
            self::AERODROMO, self::RADAR_ESTRATEGICO, self::CENTRO_PESQUISA,
            self::PARLAMENTO, self::FACTORY, self::SOLAR, self::COMPLEXO_RESIDENCIAL
        ];
    }
}
