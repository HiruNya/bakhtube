import {createStore, combineReducers} from "redux"

import {Course, courseReducer} from "./course";
import {SectionMap, sectionReducer} from "./sections";
import {VideoMap, videoReducer} from "./videos";

const reducers = combineReducers({
    course: courseReducer,
    sections: sectionReducer,
    videos: videoReducer,
});

export type State = {
    course: Course,
    sections: SectionMap,
    videos: VideoMap,
}

const store = createStore(reducers)

export {store}
