import {createStore, applyMiddleware} from "redux"
import {persistCombineReducers, persistStore} from "redux-persist"
import storageSession from "redux-persist/lib/storage/session"
import thunkMiddleware from "redux-thunk"

import {Course, courseReducer} from "./course"
import {Sections, sectionReducer} from "./sections"
import {VideoMap, videoReducer} from "./videos"
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

export {persistor, store}
