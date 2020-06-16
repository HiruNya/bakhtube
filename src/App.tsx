import {Col, Layout, Row, Spin} from "antd"
import React from "react"
import {PersistGate} from "redux-persist/integration/react"
import {Provider} from "react-redux"
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom"

import {persistor, store} from "./redux/store"
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
                    <Switch>
                        <Route path="/watch/:video">
                            <WatchPage />
                        </Route>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/verify">
                            <Verify />
                        </Route>
                        <Route path="/">
                            <SelectPage />
                        </Route>
                    </Switch>
            </Content>
            </Layout>
            </Router>
        </PersistGate>
        </Provider>
    );
}

export default App;
