import {Alert, Button, Spin, Typography} from "antd"
import React, {CSSProperties} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Link, useHistory, useLocation} from "react-router-dom"
import api from "./api"
import {startAuth, verify} from "./redux/auth"
import {State} from "./redux/store"
const {Text} = Typography

function Login() {
    const authState = useSelector((state: State) => state.auth)
    const dispatch = useDispatch()
    const location = useLocation()

    function auth() {
        api<{url: string, verify: string}, {}>("auth")
            .then((r) => {
                if (r != null) {
                    dispatch(startAuth(r.verify, location.pathname))
                    // window.open(r.url)
                    window.location.href = r.url
                } else {
                    console.log("Could not find authentication url.")
                }
            })
    }

    let component
    if (authState.state === 'NOT_AUTHENTICATED') {
        component = <Button onClick={auth}>Sign In</Button>
    } else {
        component = <Text>Redirecting to Google Sign In...</Text>
    }

    return (
        <div>
        { (authState.state === 'NOT_AUTHENTICATED' && authState.error)
        && <Alert message={authState.error} type={'error'} showIcon /> }

        <div style={CENTER_DIV_STYLE}>
            <Text>To access this site you'll need to login into <Text strong>Google</Text> with your <Text strong>University of Auckland</Text> account.</Text>
            <p/>
            {component}
        </div>
        </div>
    )
}

function Verify() {
    const authState = useSelector((state: State) => state.auth)
    const history = useHistory()
    const dispatch = useDispatch()

    const queries = new URLSearchParams(window.location.search)
    const code = queries.get('code')
    const state = queries.get('state')

    if (code == null || state == null) {
        return (
            <div style={CENTER_DIV_STYLE}>
                <Text>That's strange, you shouldn't be here.</Text>
            </div>
        )
    }
    if (authState.state === 'NOT_AUTHENTICATED') {
        if (authState.error == null) {
            return (
                <div style={CENTER_DIV_STYLE}>
                    <Text>You first need to login.</Text>
                    <p/>
                    <Link to={"/login"}>
                        <Text>Go to Login Page</Text>
                    </Link>
                </div>
            )
        } else {
            history.replace("/login")
        }
    } else if (authState.state === 'AUTHENTICATED') {
        if (authState.lastState) {
            history.replace(authState.lastState)
        } else {
            // Should redirect to previous path but that can be implemented later
            return (
                <div style={CENTER_DIV_STYLE}>
                    <Text strong>You're verified!</Text>
                </div>
            )
        }
    } else if (authState.state === 'VERIFYING' && !authState.verifying) {
        dispatch(verify(code, authState.verify, state))
    }

    return (
        <div style={CENTER_DIV_STYLE}>
            <Text strong>Verifying...</Text>
            <p />
            <Spin />
        </div>
    )
}

const CENTER_DIV_STYLE: CSSProperties = {
    padding: "100pt",
    textAlign: "center",
}

export {Login, Verify}
