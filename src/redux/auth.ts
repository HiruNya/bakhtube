import {ThunkDispatch} from "redux-thunk"

import api, {api_array} from "../api"
import jwt_decode from "jwt-decode"
import {Section, updateSections} from "./sections";
import {store} from "./store";

const START_AUTH_ACTION = "START_AUTH_ACTION"
const VERIFYING = "VERIFYING"
const AUTHENTICATED = "AUTHENTICATED"
const NOT_AUTHENTICATED = "NOT_AUTHENTICATED"

export type Auth = {state: 'NOT_AUTHENTICATED', error?: string}
    | {state: "VERIFYING", verify: string, verifying: boolean, lastState?: string}
    | {state: "AUTHENTICATED", token: string, email: string, exp: number, lastState?: string}
type AuthAction = StartAuthAction | VerifyingAction | AuthenticatedAction | NotAuthenticatedAction

type StartAuthAction = {
    type: typeof START_AUTH_ACTION,
    verify: string,
    lastState?: string,
}
type VerifyingAction = {
    type: typeof VERIFYING,
}
type AuthenticatedAction = {
    type: typeof AUTHENTICATED,
    token: string,
}
type NotAuthenticatedAction = {
    type: typeof NOT_AUTHENTICATED,
    error?: string,
}

function authReducer(state: Auth = {state: 'NOT_AUTHENTICATED'}, action: AuthAction): Auth {
    switch (action.type) {
        case START_AUTH_ACTION:
            return {state: 'VERIFYING',  verify: action.verify, verifying: false, lastState: action.lastState}
        case VERIFYING:
            if (state != null && state.state === 'VERIFYING') {
                return {...state, verifying: true}
            }
            break;
        case AUTHENTICATED:
            const lastState = (state.state !== "NOT_AUTHENTICATED")? state.lastState: undefined
            api_array<Section>("classes/softeng250/sections", action.token)
                .then((resp) => {
                    if (resp) {
                        store.dispatch(updateSections("softeng250", resp))
                    } else {
                        console.error("Sections not found.")
                    }
                })
            const {email, exp} = jwt_decode(action.token)
            return {state: 'AUTHENTICATED', token: action.token, email, exp, lastState}
        case NOT_AUTHENTICATED:
            return {state: "NOT_AUTHENTICATED", error: action.error}
    }
    return state
}

function startAuth(verify: string, lastState?: string): StartAuthAction {
    return {
        type: START_AUTH_ACTION,
        verify,
        lastState,
    }
}

function authenticated(token: string): AuthAction {
    return {
        type: AUTHENTICATED,
        token
    }
}

function notAuthenticated(error?: string): NotAuthenticatedAction {
    return {
        type: NOT_AUTHENTICATED,
        error,
    }
}

function verify(code: string, verify: string, state: string) {
    return (dispatch: ThunkDispatch<{}, {}, any>) => {
        dispatch({type: VERIFYING})
        api<{token: string}, {code: string, verify: string, state: string}>(`auth/verify`, {code, verify, state})
            .then((r) => {
                if (r === null) {
                    return notAuthenticated("A strange error occurred.")
                }
                switch (r.status) {
                    case 200:
                        return authenticated(r.token)
                    case 403:
                        return notAuthenticated("You need to use an email that ends with `@aucklanduni.ac.nz` or `@auckland.ac.nz`.")
                    default:
                        return notAuthenticated(`A strange error occurred. Status Code: ${r.status}.`)
                }
            })
            .then(dispatch)
    }
}

export {authReducer, authenticated, notAuthenticated, startAuth, verify}
