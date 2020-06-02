import {Layout, PageHeader} from "antd"
import React from 'react'

import {SectionSelector} from "./SectionSelector"

const {Content} = Layout;

function SelectPage() {
    return (
        <Layout className="layout">
            <Content style={{padding: "10pt"}}>
                <PageHeader title="Select a Section"/>
                <SectionSelector/>
            </Content>
        </Layout>
    );
}

export default SelectPage;
