export type PlayerSettings = {
    speed: number,
}
const INITIAL_PLAYER_SETTINGS = {
    speed: 1.0,
}

type PlayerSettingsAction = SetSpeed;

const SET_SPEED: string = "SET_SPEED"
type SetSpeed = {
    type: typeof SET_SPEED,
    speed: number,
}
function setSpeed(speed: number): SetSpeed {
    return { type: SET_SPEED, speed }
}

function playerSettingsReducer(state: PlayerSettings = INITIAL_PLAYER_SETTINGS, action: PlayerSettingsAction): PlayerSettings {
    switch (action.type) {
        case SET_SPEED:
            return {
                ...state,
                speed: action.speed,
            }
    }
    return state
}

export {playerSettingsReducer, setSpeed}
