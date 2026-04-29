/**
 * Game Type Definitions - Modern Warfare (Tribal Wars Style)
 * FASE HARDEN: Estabilização de Tipos (Eliminação de any)
 */

export interface ResourceSet {
    suprimentos: number;
    combustivel: number;
    municoes: number;
    metal: number;
    energia: number;
    pessoal: number;
    pessoal_max: number;
}

export interface Building {
    id: number;
    base_id: number;
    tipo: string;
    nivel: number;
    pos_x: number;
    pos_y: number;
}

export interface Unit {
    id: number;
    base_id: number;
    unit_type_id: number;
    quantity: number;
    type?: UnitType;
}

export interface UnitType {
    id: number;
    name: string;
    code: string;
    description: string;
    attack: number;
    defense: number;
    speed: number;
    carry_capacity: number;
    building_type: string;
}

export interface BaseData {
    id: number;
    jogador_id: number;
    nome: string;
    coordenadas: string;
    pontos: number;
    lealdade: number;
    resources?: ResourceSet;
    buildings?: Building[];
    units?: Unit[];
    groups?: number[];
    queues?: {
        buildings: number;
        units: number;
    };
    movements?: {
        outgoing: number;
        incoming: number;
    };
}

export interface Group {
    id: number;
    name: string;
    color: string;
}

export interface TemplateStep {
    unit_type_id: number;
    quantity: number;
}

export interface Template {
    id: number;
    name: string;
    steps: TemplateStep[];
}

export interface Jogador {
    id: number;
    username: string;
    pontos: number;
    alianca_id?: number;
}
