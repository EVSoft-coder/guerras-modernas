<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ManualController extends Controller
{
    public function index()
    {
        return Inertia::render('Manual', [
            'sections' => [
                [
                    'title' => 'Fundamentos de Comando',
                    'content' => 'O Guerras Modernas é um simulador tático de larga escala. O seu objetivo é expandir a sua influência territorial através da gestão estratégica de recursos e da coordenação militar precisa.'
                ],
                [
                    'title' => 'Gestão de Recursos Críticos',
                    'content' => 'O sucesso depende de 5 pilares: Suprimentos (Manutenção), Combustível (Logística), Munições (Confronto), Metal (Engenharia) e Energia (Pesquisa). Mantenha as suas instalações industriais atualizadas para garantir um fluxo constante.'
                ],
                [
                    'title' => 'Doutrina de Combate',
                    'content' => 'A força de ataque é calculada com base na letalidade das tropas e nos seus bónus de pesquisa. A defesa é potenciada pela Muralha e pela Blindagem. Unidades mais pesadas são mais lentas, mas carregam mais recursos (Loot) após a vitória.'
                ],
                [
                    'title' => 'Apoio e Reforços Aliados',
                    'content' => 'Pode estacionar tropas em bases aliadas para proteção mútua. Estas tropas participam na defesa como se fossem locais, mas o dono original pode retirá-las a qualquer momento através do painel de logística.'
                ],
                [
                    'title' => 'Inteligência e Espionagem',
                    'content' => 'Antes de atacar, envie drones de espionagem para revelar a guarnição e o stock de recursos do inimigo. A eficácia depende da quantidade de drones enviados face à defesa eletrónica do alvo.'
                ],
                [
                    'title' => 'Eventos de Mundo',
                    'content' => 'O Comando Global pode declarar eventos especiais que alteram as regras temporariamente: "Boom Económico" (Produção x2), "Exercícios Militares" (Recrutamento x2) ou "Avanço Logístico" (Velocidade x2).'
                ]
            ]
        ]);
    }
}
