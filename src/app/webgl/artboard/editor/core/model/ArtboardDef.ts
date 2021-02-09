/**
 * Created by mdavids on 09/02/2021.
 */

export enum DefVersion {
    V01 = "0.1"
}

export const DEF_VERSION: string = DefVersion.V01;

export enum Class {
    Project = 'project',
    ArtboardObject = 'artboard-object',
    ImageComponent = 'image',
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
    attributes: AttributesDef;
    components: ComponentDef[];
    objects: ArtboardObjectDef[];
}

export interface AttributesDef {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;  // Radians
    alpha: number;     // [0..1]
}

export interface ComponentDef {
    class: Class;
}

export interface ImageComponentDef extends ComponentDef {
    id: string;
    class: Class;
    src: string;
}
