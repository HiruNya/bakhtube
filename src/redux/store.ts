import {createStore, applyMiddleware} from "redux"
import {persistCombineReducers, persistStore} from "redux-persist"
import storageSession from "redux-persist/lib/storage/session"
import thunkMiddleware from "redux-thunk"

import {Course, courseReducer} from "./course"
import {Sections, sectionReducer, updateSections, Section} from "./sections"
import {VideoMap, videoReducer} from "./videos"
import {api_array} from "../api"
import {Auth, authReducer} from "./auth"

const reducers = persistCombineReducers<{}, any>({key: 'root', storage: storageSession}, {
    auth: authReducer,
    course: courseReducer,
    sections: sectionReducer,
    videos: videoReducer,
});

export type State = {
    auth: Auth,
    course: Course,
    sections: Sections,
    videos: VideoMap,
}

const store = createStore(reducers, applyMiddleware(thunkMiddleware))
const persistor = persistStore(store)

api_array<Section>("classes/softeng250/sections")
    .then((resp) => {
        if (resp) {
            store.dispatch(updateSections("softeng250", resp))
        } else {
            console.error("Sections not found.")
        }
    })

export {persistor, store}
