<?php
 
namespace App\Domain\Building;
 
class BuildingType
{
    const QG = 'qg';
    const MURALHA = 'muralha';
    const FAZENDA = 'mina_suprimentos';
    const MINA_SUPRIMENTOS = 'mina_suprimentos';
    const REFINARIA = 'refinaria';
    const FABRICA_MUNICOES = 'fabrica_municoes';
    const POSTO_RECRUTAMENTO = 'posto_recrutamento';
    const QUARTEL = 'quartel';
    const AERODROMO = 'aerodromo';
    const RADAR_ESTRATEGICO = 'radar_estrategico';
    const CENTRO_PESQUISA = 'centro_pesquisa';
    const PARLAMENTO = 'parlamento';
    const FACTORY = 'mina_metal';
    const SOLAR = 'central_energia';
    const MINA_METAL = 'mina_metal'; 
    const CENTRAL_ENERGIA = 'central_energia';
    const HOUSING = 'housing';
 
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
            'complexo_residencial' => self::HOUSING,
            'habitacao' => self::HOUSING,
            'complexo_habitacional' => self::HOUSING,
            'housing' => self::HOUSING,
        ];
 
        $cleaned = strtolower(str_replace([' ', '_', '-'], '', $type));
        return $map[$cleaned] ?? $type;
    }
 
    public static function all(): array
    {
        return [
            self::PARLAMENTO, self::MINA_METAL, self::CENTRAL_ENERGIA, self::HOUSING
        ];
    }
}
