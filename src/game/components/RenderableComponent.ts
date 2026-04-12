import { Component } from '../../core/EntityManager';

export interface RenderableComponent extends Component {
    type: 'Renderable';
    renderType: "unit" | "building";
    sprite?: string;
}
