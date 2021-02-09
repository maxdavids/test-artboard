import { ProjectDef } from "../core/model/ArtboardDef";

export default class Deserializer {
    
    public deserializeFromJson = (projectJson: string): ProjectDef => {
        const projectDef: ProjectDef = <ProjectDef>JSON.parse(projectJson);
        return projectDef;
    }
}
