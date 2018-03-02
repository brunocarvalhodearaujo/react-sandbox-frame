import * as React from 'react'

interface Props {
  children?: React.ReactNode,
  onLoad?: () => void,
  src?: string,
  stylesheets?: [],
  scripts?: []
}

declare class Initial extends React.Component<Props> {}

export { Frame }
export default Initial
