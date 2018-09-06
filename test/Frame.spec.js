import React from 'react'
import Frame from '../src'
import { shallow } from 'enzyme'

describe('#Frame', () => {
  it('check if have iframe', () => {
    const component = shallow(<Frame />)
    const node = component.find('iframe').length

    expect(node).toEqual(1)
  })

  it('check children content', () => {
    const component = shallow(
      <Frame>
        <p>dsadsadsa</p>
      </Frame>
    )

    console.log(component.text())
  })
})
