import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode, unmountComponentAtNode } from 'react-dom'
import { renderToStaticMarkup } from 'react-dom/server'
import is from 'is'
import fs from 'fs'

export default class Frame extends Component {

  /**
   *
   * @param {HTMLElement} DOMNode
   */
  renderFrame (DOMNode = (findDOMNode(this).contentDocument || findDOMNode(this).contentWindow.document)) {
    if (DOMNode.readyState === 'complete') {
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
      var $script = fs.readFileSync('./node_modules/scriptjs/dist/script.min.js', 'utf8')
      const scriptElement = DOMNode.createElement('script')
      scriptElement.type = 'text/javascript'
      scriptElement.innerHTML = `${$script}; $script.order(${JSON.stringify(this.props.scripts)},'bundle')`
      DOMNode.head.appendChild(scriptElement)
      this.props.onLoad(DOMNode)
    } else {
      setTimeout(this.renderFrame.bind(this), 500)
    }
  }

  componentDidMount () {
    this.renderFrame()
  }

  componentDidUpdate () {
    this.renderFrame()
  }

  componentWillUnmount () {
    unmountComponentAtNode(this)
  }

  render () {
    const { src, title, className } = this.props
    return <iframe {...{ src, title, className }} />
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
