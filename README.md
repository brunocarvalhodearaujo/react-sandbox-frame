React Sandbox Frame
===================

this package create an customizable and declarative iframe

## usage

``````js
import React, { Component } from 'react'
import Frame from 'react-sandbox-frame'

export class WebView extends Component {

  /**
   * connect frame and you component
   * @param {HTMLElement} document
   */
  onLoad (document) {
    console.log(document) // output <p>hello world</p>
  }

  render () {
    return (
      <Frame onLoad={this.onLoad.bind(this)}>
        <p>hello world</p>
      </Frame>
    )
  }

}
``````

## Optional Props

The `Frame` component takes a couple of props that you can use to customize its behaviour:

  - `children [?element]`
  - `onLoad [?function]`
  - `src [?string]`
  - `style [?object]`
  - `title [?string=page-wrapper]`
  - `stylesheets [?Array<String>=[]]`
  - `scripts [?Array<String>=[]]`
