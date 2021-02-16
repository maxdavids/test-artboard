/**
 * Created by mdavids on 09/02/2021.
 */

export enum Version {
    V01 = "0.1"
}

export const CURRENT_VERSION: string = Version.V01;

export enum Class {
    Internal = 'internal',
    Project = 'project',
    ArtboardObject = 'artboard-object',
    TransformComponent = 'transform',
    ImageComponent = 'image',
    RectangleComponent = 'rectangle',
}

export interface ProjectDef {
    id: string;
    version: string;
    class: Class;
    scene: ArtboardObjectDef;
}

export interface ArtboardObjectDef {
    id: string;
    class: Class;
    components: ComponentDef[];
    objects: ArtboardObjectDef[];
}

export interface ComponentDef {
    class: Class;
}

export interface TransformComponentDef extends ComponentDef {
    id: string;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
}

export interface RectangleComponentDef extends ComponentDef {
    id: string;
    class: Class;
    width: number;
    height: number;
}

export interface ImageComponentDef extends ComponentDef {
    id: string;
    class: Class;
    src: string;
}
