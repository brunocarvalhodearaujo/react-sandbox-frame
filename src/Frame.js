import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode, unmountComponentAtNode } from 'react-dom'
import { renderToStaticMarkup } from 'react-dom/server'
import is from 'is'
import fs from 'fs'
import pickBy from 'lodash.pickBy'
import omit from 'lodash.omit'

export default class Frame extends Component {
  static propTypes = {
    children: PropTypes.element,
    onLoad: PropTypes.func,
    src: PropTypes.string,
    stylesheets: PropTypes.arrayOf(PropTypes.string).isRequired,
    scripts: PropTypes.arrayOf(PropTypes.string).isRequired
  }

  static defaultProps = {
    scripts: [],
    stylesheets: []
  }

  /**
   * retrieve instance of iframe contents
   * @return {HTMLElement}
   */
  getDOMNode () {
    return (findDOMNode(this).contentDocument || findDOMNode(this).contentWindow.document)
  }

  /**
   * check if frame is loaded
   * @return {Promise<boolean>}
   */
  isReady () {
    return new Promise((resolve, reject) => {
      const DOMNode = this.getDOMNode()
      DOMNode.addEventListener('load', () => resolve(true))
      if (DOMNode.readyState === 'complete') {
        resolve(true)
      }
    })
  }

  /**
   * render and update frame contents
   */
  renderFrame () {
    return this.isReady().then(() => {
      const DOMNode = this.getDOMNode()
      if (this.props.hasOwnProperty('children') && !this.props.hasOwnProperty('src')) {
        DOMNode.body.innerHTML = is.string(this.props.children)
          ? this.props.children
          : renderToStaticMarkup(this.props.children)
      }
      const head = DOMNode.getElementsByTagName('head')[ 0 ]
      this.props.stylesheets.forEach(url => {
        if (!head.querySelector(`link[href="${url}"]`)) {
          const ref = DOMNode.createElement('link')
          ref.rel = 'stylesheet'
          ref.type = 'text/css'
          ref.href = url
          head.appendChild(ref)
        }
      })
      if (Boolean(this.props.scripts.length) && !head.querySelector(`script[of="${this.props.title}"]`)) {
        const $script = fs.readFileSync('./node_modules/scriptjs/dist/script.min.js', 'utf8')
        const ref = DOMNode.createElement('script')
        ref.setAttribute('type', 'text/javascript')
        ref.setAttribute('of', this.props.title)
        ref.innerHTML = `${$script}; $script.order(${JSON.stringify(this.props.scripts)},'bundle')`
        DOMNode.head.appendChild(ref)
      }
      if (this.props.hasOwnProperty('onLoad')) {
        this.props.onLoad(DOMNode)
      }
    })
  }

  componentDidMount () {
    this.renderFrame()
  }

  componentWillUnmount () {
    unmountComponentAtNode(this)
  }

  render () {
    let props = pickBy(omit(this.props, [ 'stylesheets', 'scripts' ]))
    if (!is.undefined(props.src)) {
      props.onLoad = this.renderFrame.bind(this)
    }
    return <iframe {...props} />
  }
}
