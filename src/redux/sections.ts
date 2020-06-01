import api from "../api";
import {store} from "./store";

const GET_SECTIONS: string = "GET_SECTIONS"

export type SectionMap = Map<string, Array<Section>>

type GetSectionsAction = {
    type: typeof GET_SECTIONS,
    course: string,
    sections: Array<Section>,
}

export type Section = {
    id: string,
    name: string,
    video: string,
    timestamp?: string,
    major: number,
    minor?: number,
    detail?: number,
}

const INITIAL_STATE: Map<string, Array<Section>> = (new Map()).set("softeng250", [
    // {
    //     id: "1",
    //     name: "Section 1",
    //     video: "1.mp4",
    //     major: "1"
    // }
])

api("classes/softeng250/sections")
    .then((resp) => store.dispatch(updateSections("softeng250", resp)))
    .then(() => console.log("Done"))

function sectionReducer(state: SectionMap = INITIAL_STATE, action: GetSectionsAction) {
    switch (action.type) {
        case GET_SECTIONS:
            const sections = new Map(state)
            sections.set(action.course, action.sections)
            return sections
    }
    return state
}

function updateSections(course: string, sections: Array<Section>): GetSectionsAction {
    return {
        type: GET_SECTIONS,
        course,
        sections,
    }
}

export { sectionReducer, updateSections }
