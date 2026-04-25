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
                    'content' => 'O Guerras Modernas é um simulador tático de larga escala. O seu objetivo é expandir a sua influência territorial, gerir recursos críticos e neutralizar ameaças através de operações militares coordenadas.'
                ],
                [
                    'title' => 'Gestão de Recursos',
                    'content' => 'Existem 5 recursos vitais: Suprimentos (Base), Combustível (Mobilidade), Munições (Poder de Fogo), Metal (Estruturas) e Energia (Tecnologia). A produção é horária e baseada no nível das suas instalações industriais.'
                ],
                [
                    'title' => 'Infraestrutura (Edifícios)',
                    'content' => 'O Centro de Comando (HQ) desbloqueia novas tecnologias. O Quartel permite a mobilização de tropas. A Muralha oferece bónus defensivos passivos contra incursões inimigas.'
                ],
                [
                    'title' => 'Operações Militares',
                    'content' => 'Pode enviar tropas para Atacar (pilhar recursos ou conquistar bases) ou Apoiar (defender aliados). O tempo de viagem é real e depende da distância no mapa e da velocidade da unidade mais lenta.'
                ],
                [
                    'title' => 'Proteção de Novatos',
                    'content' => 'Novos comandantes recebem o "Escudo Operacional" por 72 horas. Durante este período, não podem ser atacados, mas perdem a proteção se iniciarem uma operação ofensiva contra outro jogador.'
                ]
            ]
        ]);
    }
}
