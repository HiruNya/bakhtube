import React from "react"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import WatchPage from "./WatchPage"
import SelectPage from "./SelectPage"
import {Col, Layout, Row} from "antd"
import {Provider} from "react-redux"
import {store} from "./redux/store"
import SectionSearch from "./SectionSearch"
const {Content, Header} = Layout

function App() {
    return (
        <Provider store={store}>
            <Router>
            <Layout>
            <Header className="ant-layout-header">
                <Row gutter={30} >
                    <Col>
                        <h1>BakhTube</h1>
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
                        <Route path="/">
                            <SelectPage />
                        </Route>
                    </Switch>
            </Content>
            </Layout>
            </Router>
</Provider>
    );
}

export default App;
