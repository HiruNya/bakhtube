import {createStore, combineReducers} from "redux"

import {Course, courseReducer} from "./course";
import {Sections, sectionReducer, updateSections} from "./sections";
import {VideoMap, videoReducer} from "./videos";
import api from "../api";

const reducers = combineReducers({
    course: courseReducer,
    sections: sectionReducer,
    videos: videoReducer,
});

export type State = {
    course: Course,
    sections: Sections,
    videos: VideoMap,
}

const store = createStore(reducers)

api("classes/softeng250/sections")
    .then((resp) => store.dispatch(updateSections("softeng250", resp)))

export {store}
