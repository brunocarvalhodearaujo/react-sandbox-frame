import * as React from 'react'

interface Props {
  children?: React.ReactNode,
  onLoad?: () => void,
  src?: string,
  style?: React.CSSProperties,
  title?: string,
  stylesheets?: string[],
  scripts?: string[]
}

declare class Frame extends React.Component<Props> {}

export { Frame }
export default Frame
