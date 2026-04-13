<?php
 
namespace App\Enums;
 
enum BuildingType: string
{
    case QG = 'qg';
    case MURALHA = 'muralha';
    case MINA_SUPRIMENTOS = 'mina_suprimentos';
    case REFINARIA = 'refinaria';
    case FABRICA_MUNICOES = 'fabrica_municoes';
    case POSTO_RECRUTAMENTO = 'posto_recrutamento';
    case QUARTEL = 'quartel';
    case AERODROMO = 'aerodromo';
    case RADAR_ESTRATEGICO = 'radar_estrategico';
    case CENTRO_PESQUISA = 'centro_pesquisa';
    case FACTORY = 'factory';
    case SOLAR = 'solar';
    case PARLAMENTO = 'parlamento';
 
    public function label(): string
    {
        return match ($this) {
            self::QG => 'Centro de Comando (QG)',
            self::MURALHA => 'Perímetro Defensivo (Muralha)',
            self::MINA_SUPRIMENTOS => 'Mina de Suprimentos',
            self::REFINARIA => 'Refinaria de Combustível',
            self::FABRICA_MUNICOES => 'Fábrica de Munições',
            self::POSTO_RECRUTAMENTO => 'Posto de Recrutamento',
            self::QUARTEL => 'Quartel Regional',
            self::AERODROMO => 'Aeródromo Militar',
            self::RADAR_ESTRATEGICO => 'Radar de Longo Alcance',
            self::CENTRO_PESQUISA => 'Centro de Pesquisa & I&D',
            self::FACTORY => 'Mina de Metal Industrial',
            self::SOLAR => 'Central de Energia Solar',
            self::PARLAMENTO => 'Sede do Parlamento',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
