import React, {ReactText} from "react"
import {Tree} from "antd"
import {useHistory} from "react-router-dom"

function SectionSelector() {
    const history = useHistory()

    function onSelect(keys: Array<ReactText>, _: {}) {
        if (keys.length !== 0) {
            console.log(keys[0])
            history.push(`/watch/${keys[0]}`)
        }
    }

    return (
        <Tree treeData={treeData} onSelect={onSelect} selectable/>
    );
}

const treeData = [
    {
        title: "Lecture Notes 1",
        key: "1",
        children: [
            {
                title: "Lecture Notes 1a",
                key: "10",
                children: [
                    {
                        title: "Lecture Notes 1a.1",
                        key: "1-0-0"
                    }
                ]
            },
            {
                title: "Lecture Notes 1b",
                key: "1-1"
            }
        ]
    },
    {
        title: "Lecture Notes 2",
        key: "2",
        children: [
            {
                title: "Hi",
                key: "20",
                children: []
            }
        ]
    }
];

export {SectionSelector};
