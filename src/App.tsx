import {Col, Layout, Row, Spin} from "antd"
import React, {ReactElement} from "react"
import {PersistGate} from "redux-persist/integration/react"
import {Provider, useSelector} from "react-redux"
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom"

import {persistor, State, store} from "./redux/store"
import {Login, Verify} from "./login"
import SelectPage from "./SelectPage"
import SectionSearch from "./SectionSearch"
import WatchPage from "./WatchPage"
const {Content, Header} = Layout

function App() {
    return (
        <Provider store={store}>
        <PersistGate loading={<Spin />} persistor={persistor}>
            <Router>
            <Layout>
            <Header className="ant-layout-header">
                <Row gutter={30} >
                    <Col>
                        <Link to="/">
                            <h1>BakhTube</h1>
                        </Link>
                    </Col>
                    <Col flex={1}>
                        <SectionSearch />
                    </Col>
                </Row>
            </Header>
            <Content>
                <LoginGuard>
                    <Switch>
                        <Route path="/watch/:video">
                            <WatchPage />
                        </Route>
                        <Route path="/">
                            <SelectPage />
                        </Route>
                    </Switch>
                </LoginGuard>
            </Content>
            </Layout>
            </Router>
        </PersistGate>
        </Provider>
    );
}

function LoginGuard(props: {children: ReactElement, redirect?: string}): ReactElement {
    const auth = useSelector((state: State) => state.auth)
    if (auth.state !== 'AUTHENTICATED') {
        return (
            <Switch>
                <Route path="/verify">
                    <Verify />
                </Route>
                <Route path="/">
                    <Login />
                </Route>
            </Switch>
        )
    } else {
        return props.children
    }
}

export default App;
