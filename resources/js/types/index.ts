import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    username?: string;
    xp?: number;
    alianca_id?: number | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Recurso {
    id: number;
    base_id: number;
    suprimentos: number;
    combustivel: number;
    municoes: number;
    pessoal: number;
    metal: number;
    energia: number;
    cap: number;
    updated_at: string;
}

export interface Edificio {
    id: number;
    base_id: number;
    tipo?: string; // deprecated
    buildingType: string;
    nivel: number;
    pos_x: number;
    pos_y: number;
}

export interface FilaConstrucao {
    id: number;
    base_id: number;
    edificio_tipo?: string; // deprecated
    buildingType: string;
    nivel_destino: number;
    completado_em: string;
    created_at: string;
}

export interface BuildingQueueMember {
    id: number;
    base_id: number;
    type: string;
    target_level: number;
    started_at: string;
    finishes_at: string;
}

export interface Base {
    id: number;
    ownerId: number;
    nome: string;
    coordenada_x: number;
    coordenada_y: number;
    qg_nivel: number;
    muralha_nivel: number;
    recursos: Recurso;
    edificios: Edificio[];
    buildingQueue?: BuildingQueueMember[];
    construcoes: FilaConstrucao[];
    treinos: any[];
    tropas: any[];
}

export interface DashboardProps {
    jogador: User;
    base: Base;
    bases: Base[];
    buildings?: any[];
    population?: any;
    resources?: any;
    relatorios: any[];
    relatoriosGlobal: any[];
    taxas: Record<string, number>;
    taxasPerSecond: Record<string, number>;
    intelLevel: number;
    popOcupada: number;
    capTotal: number;
    popPercent: number;
    gameConfig: any;
    ataquesRecebidos: any[];
    ataquesEnviados: any[];
    buildingQueue?: any[];
    unitQueue?: any[];
    units?: any[];
    unitTypes?: any[];
    gameData?: {
        resources: Recurso;
        units: any[];
        buildings?: any[];
        population?: any;
        movements: {
            sent: any[];
            received: any[];
        };
    };
}
