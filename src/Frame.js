import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode, unmountComponentAtNode } from 'react-dom'
import { renderToStaticMarkup } from 'react-dom/server'
import is from 'is'
import fs from 'fs'
import { pickBy } from 'lodash'

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
      if (!head.querySelector(`script[of="${this.props.title}"]`) && this.props.scripts.length) {
        var $script = fs.readFileSync('./node_modules/scriptjs/dist/script.min.js', 'utf8')
        const scriptElement = DOMNode.createElement('script')
        scriptElement.setAttribute('type', 'text/javascript')
        scriptElement.setAttribute('of', this.props.title)
        scriptElement.innerHTML = `${$script}; $script.order(${JSON.stringify(this.props.scripts)},'bundle')`
        DOMNode.head.appendChild(scriptElement)
      }
      if (this.props.hasOwnProperty('onLoad')) {
        this.props.onLoad(DOMNode)
      }
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
    const { src, title, className, style } = this.props
    return <iframe {...pickBy({ src, title, className, style })} />
  }

}

Frame.propTypes = {
  children: PropTypes.element,
  onLoad: PropTypes.func,
  src: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string.isRequired,
  stylesheets: PropTypes.arrayOf(PropTypes.string),
  scripts: PropTypes.arrayOf(PropTypes.string)
}

Frame.defaultProps = {
  title: 'frame-wrapper',
  scripts: [],
  stylesheets: []
}
