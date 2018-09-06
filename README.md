React Sandbox Frame
===================

[![npm version](https://badge.fury.io/js/react-sandbox-frame.svg)](http://badge.fury.io/js/react-sandbox-frame)
[![License](https://img.shields.io/npm/l/react-sandbox-frame.svg)](https://www.npmjs.com/package/react-sandbox-frame) 
[![Dependency Status](https://david-dm.org/brunocarvalhodearaujo/react-sandbox-frame.svg?style=flat-square)](https://david-dm.org/brunocarvalhodearaujo/react-sandbox-frame)
[![devDependency Status](https://david-dm.org/brunocarvalhodearaujo/react-sandbox-frame/dev-status.svg?style=flat-square)](https://david-dm.org/brunocarvalhodearaujo/react-sandbox-frame#info=devDependencies)
[![npm](https://img.shields.io/npm/dt/react-sandbox-frame.svg)](https://github.com/brunocarvalhodearaujo/react-sandbox-frame)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

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
