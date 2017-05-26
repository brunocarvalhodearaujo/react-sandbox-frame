import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode, unmountComponentAtNode } from 'react-dom'
import { renderToStaticMarkup } from 'react-dom/server'
import is from 'is'

export default class Frame extends Component {

  updateFrame () {
    const DOMNode = (findDOMNode(this).contentDocument || findDOMNode(this).contentWindow.document)
    if (DOMNode.readyState !== 'complete') {
      return
    }
    if (this.props.hasOwnProperty('children') && !this.props.hasOwnProperty('src')) {
      DOMNode.body.innerHTML = is.string(this.props.children)
        ? this.props.children
        : renderToStaticMarkup(this.props.children)
    }
    const head = DOMNode.getElementsByTagName('head')[0]
    this.props.stylesheets.forEach(url => {
      if (!head.querySelector(`link[href="${url}"]`)) {
        const ref = DOMNode.createElement('link')
        ref.rel = 'stylesheet'
        ref.type = 'text/css'
        ref.href = url
        head.appendChild(ref)
      }
    })
    this.props.scripts.forEach(source => {
      if (!head.querySelector(`script[src="${source}"]`)) {
        const tag = DOMNode.createElement('script')
        tag.src = source
        head.appendChild(tag)
      }
    })
  }

  onLoad () {
    if (this.props.hasOwnProperty('onLoad') && is.function(this.props.onLoad)) {
      const DOMNode = (findDOMNode(this).contentDocument || findDOMNode(this).contentWindow.document)
      this.props.onLoad(DOMNode)
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
    const { src, title, className } = this.props
    return <iframe {...{ src, title, className }} onLoad={this.onLoad.bind(this)} />
  }

}

Frame.propTypes = {
  children: PropTypes.element,
  onLoad: PropTypes.func,
  src: PropTypes.string,
  title: PropTypes.string.isRequired,
  stylesheets: PropTypes.arrayOf(PropTypes.string),
  scripts: PropTypes.arrayOf(PropTypes.string)
}

Frame.defaultProps = {
  title: 'frame-wrapper',
  scripts: [],
  stylesheets: []
}
