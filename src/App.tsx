import React from "react"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import WatchPage from "./WatchPage"
import SelectPage from "./SelectPage"
import {Layout, PageHeader} from "antd"
import {Provider} from "react-redux";
import {store} from "./redux/store";
const {Content, Header} = Layout

function App() {
    return (
        <Provider store={store}>
        <Layout>
            <Header className="ant-layout-header">
                <div>
                    <PageHeader className="site-page-header" title="BakhTube"/>
                </div>
            </Header>
            <Content>
                <Router>
                    <Switch>
                        <Route path="/watch/:video">
                            <WatchPage />
                        </Route>
                        <Route path="/">
                            <SelectPage />
                        </Route>
                    </Switch>
                </Router>
            </Content>
        </Layout>
        </Provider>
    );
}

export default App;
