import { ProjectDef } from "../core/model/ArtboardDef";
import Project from "../core/Project";

export default class Serializer {
 
    public serializeToJson = (project: Project): string => {
        const projectDef: ProjectDef = project.serialize();   
        const projectJson: string = JSON.stringify(projectDef);
    
        return projectJson;
    }
    
}