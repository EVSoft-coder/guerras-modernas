<?php
 
namespace App\Domain\Building;
 
class BuildingType
{
    const HQ = 'hq';
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
    const FACTORY = 'mina_metal';
    const SOLAR = 'central_energia';
    const MINA_METAL = 'mina_metal'; 
    const CENTRAL_ENERGIA = 'central_energia';
    const HOUSING = 'housing';
    const MERCADO = 'mercado';
    const ARMAZEM = 'armazem';
 
    /**
     * Aliases para compatibilidade com nomes legados ou front-end.
     * FASE DADOS: Garantir snake_case absoluto.
     */
    public static function normalize(string $type): string
    {
        // 1. Limpeza Base: Lowercase + Trim
        $raw = trim(strtolower($type));
        
        // 2. Mapeamento de Aliases Tácticos
        $map = [
            'mercado' => self::MERCADO,
            'hub de comércio' => self::MERCADO,
            'logistica' => self::MERCADO,
            'qg' => self::HQ,
            'hq' => self::HQ,
            'quartelgeneral' => self::HQ,
            'quartel general' => self::HQ,
            'centrocomando' => self::HQ,
            'centro de comando' => self::HQ,
            'muralha' => self::MURALHA,
            'perimetro' => self::MURALHA,
            'perimetro defensivo' => self::MURALHA,
            'arsenal' => self::FABRICA_MUNICOES,
            'fabricamunicoes' => self::FABRICA_MUNICOES,
            'fábrica de munições' => self::FABRICA_MUNICOES,
            'minasuprimentos' => self::MINA_SUPRIMENTOS,
            'mina de suprimentos' => self::MINA_SUPRIMENTOS,
            'mina' => self::MINA_SUPRIMENTOS,
            'refinaria' => self::REFINARIA,
            'refinaria de combustível' => self::REFINARIA,
            'aerodromo' => self::AERODROMO,
            'aeródromo militar' => self::AERODROMO,
            'heliponto' => self::AERODROMO,
            'postorecrutamento' => self::POSTO_RECRUTAMENTO,
            'posto de recrutamento' => self::POSTO_RECRUTAMENTO,
            'quartel' => self::QUARTEL,
            'quartel regional' => self::QUARTEL,
            'radar' => self::RADAR_ESTRATEGICO,
            'radar estratégico' => self::RADAR_ESTRATEGICO,
            'radar de longo alcance' => self::RADAR_ESTRATEGICO,
            'centropesquisa' => self::CENTRO_PESQUISA,
            'centro de pesquisa' => self::CENTRO_PESQUISA,
            'factory' => self::FACTORY,
            'fabrica' => self::FACTORY,
            'solar' => self::SOLAR,
            'plantasolar' => self::SOLAR,
            'minametal' => self::FACTORY,
            'mina de metal' => self::FACTORY,
            'centralenergia' => self::SOLAR,
            'central de energia solar' => self::SOLAR,
            'complexoresidencial' => self::HOUSING,
            'habitacao' => self::HOUSING,
            'complexohabitacional' => self::HOUSING,
            'complexo residencial' => self::HOUSING,
            'housing' => self::HOUSING,
            'armazem' => self::ARMAZEM,
            'deposito' => self::ARMAZEM,
            'armazém' => self::ARMAZEM,
            'depósito' => self::ARMAZEM,
        ];

        if (isset($map[$raw])) {
            return $map[$raw];
        }

        // 3. Fallback: Converter para snake_case real
        return strtolower(str_replace([' ', '-'], '_', $raw));
    }
 
    public static function all(): array
    {
        return [
            self::MINA_METAL, self::CENTRAL_ENERGIA, self::HOUSING
        ];
    }
}
