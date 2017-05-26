import React, { Component } from 'react'
import { findDOMNode, unmountComponentAtNode } from 'react-dom'
import { renderToStaticMarkup } from 'react-dom/server'
import PropTypes from 'prop-types'
import _ from 'lodash'
import is from 'is'

export default class Frame extends Component {

  get document () {
    return (findDOMNode(this).contentDocument || findDOMNode(this).contentWindow.document)
  }

  updateFrame () {
    if (this.document.readyState === 'complete') {
      const head = this.document.getElementsByTagName('head')[ 0 ]
      this.props.stylesheets.forEach(url => {
        const ref = this.document.createElement('link')
        ref.rel = 'stylesheet'
        ref.type = 'text/css'
        ref.href = url
        head.appendChild(ref)
      })
      this.props.scripts.forEach(src => {
        const ref = this.document.createElement('script')
        ref.src = src
        head.appendChild(ref)
      })
      if (!is.undefined(this.props.dangerouslySetInnerHTML) && !is.undefined(this.props.dangerouslySetInnerHTML.__html)) {
        this.document.body.innerHTML = this.props.dangerouslySetInnerHTML.__html
      } else if (!is.undefined(this.props.children)) {
        this.document.body.innerHTML = renderToStaticMarkup(this.props.children)
      } else if (is.undefined(this.props.src)) {
        throw new Error('prop `src`, `children` or `dangerouslySetInnerHTML` not found')
      }
      if (this.props.hasOwnProperty('onLoad')) {
        this.props.onLoad(this.document)
      }
    } else {
      setTimeout(this.updateFrame.bind(this), 100)
    }
  }

  componentDidMount () {
    this.updateFrame()
  }

  componentDidUpdate () {
    this.updateFrame()
  }

  componentWillUnmount () {
    unmountComponentAtNode(this)
  }

  render () {
    const { title, src, className, style } = this.props
    return (
      <iframe {..._.pickBy({ title, src, className, style: _.merge({ border: 'none' }, style) })} />
    )
  }

}

Frame.propTypes = {
  dangerouslySetInnerHTML: PropTypes.object,
  children: PropTypes.element,
  onLoad: PropTypes.func,
  src: PropTypes.string,
  title: PropTypes.string.isRequired,
  stylesheets: PropTypes.arrayOf(PropTypes.string),
  scripts: PropTypes.arrayOf(PropTypes.string)
}

Frame.defaultProps = {
  title: 'webview-wrapper',
  stylesheets: [ ],
  scripts: [ ]
}
