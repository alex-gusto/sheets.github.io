export default () => {
  return [
    {
      Name: 'title',
      Visible: 0
    },
    {
      Name: 'events',
      Width: 80,
      Visible: 0,
      Button: 'Enum',
      OnClick: 'Focus,Grid.Component.props.handleRunColStartEdit(Grid,Row, Col)'
    }
  ]
}
