import React from 'react'
import { compose } from 'recompose'

import { Button, Menu } from '../../../../tw-uikit/'
import withToggleState from '../../../concerns/withToggleState'
import PopupContainer from '../misc/PopupContainer.react'
import SwitchControl from '../misc/SwitchControl.react'
import GanttAboutModal from './GanttAboutModal.react'

const enhance = compose(
  withToggleState('showMoreOptions'),
)

const GanttHeader = React.createClass({
  propTypes: {
    onNext: React.PropTypes.func.isRequired,
    onPrev: React.PropTypes.func.isRequired,
    onToday: React.PropTypes.func.isRequired,
    showMoreOptions: React.PropTypes.bool.isRequired,
    onToggleShowMoreOptions: React.PropTypes.func.isRequired,
    onToggleHideWeekend: React.PropTypes.func.isRequired,
    onToggleHideNoDateTask: React.PropTypes.func.isRequired,
    onToggleHideCompletedTask: React.PropTypes.func.isRequired,
    hideWeekend: React.PropTypes.bool,
    hideNoDateTask: React.PropTypes.bool,
    hideCompletedTask: React.PropTypes.bool,
    enableOptions: React.PropTypes.object,

    // withToggleState
    onShowAboutTimelineModal: React.PropTypes.func,
    onCloseAboutTimelineModal: React.PropTypes.func,
    showAboutTimelineModal: React.PropTypes.bool
  },

  onToggleHideWeekend () {
    this.props.onToggleHideWeekend()
    this.props.onToggleShowMoreOptions()
  },

  onToggleHideCompletedTask () {
    this.props.onToggleHideCompletedTask()
    this.props.onToggleShowMoreOptions()
  },

  onShowAboutTimelineModal () {
    this.props.onToggleShowMoreOptions()
    this.props.onShowAboutTimelineModal()
  },

  renderMoreOptions () {
    return (
      <PopupContainer
        strategy='bottom right'
        gap={6}
        onClickOutside={this.props.onToggleShowMoreOptions}
        content={this.renderMoreOptionsMenu}
        open={this.props.showMoreOptions}
      >
        <div className='tw-gantt-header__more-options'>
          <Button
            icon='vertical-dots'
            onClick={this.props.onToggleShowMoreOptions}
            style='blend-dark'
            className='ax-timeline-view-more-options-button'
          />
        </div>
      </PopupContainer>
    )
  },

  renderMoreOptionsMenu () {
    const enableOptions = this.props.enableOptions
    const showWeekendSwitch = (
      <SwitchControl
        state={!this.props.hideWeekend}
        onStateChange={this.props.onToggleHideWeekend}
      />
    )

    const showCompletedTaskSwitch = (
      <SwitchControl
        state={!this.props.hideCompletedTask}
        onStateChange={this.props.onToggleHideCompletedTask}
      />
    )

    const showTasksWithOutDate = (
      <SwitchControl
        state={!this.props.hideNoDateTask}
        onStateChange={this.props.onToggleHideNoDateTask}
      />
    )

    const menuItemShowWeekend = enableOptions.hideWeekend ? (
      <Menu.Item right={showWeekendSwitch} disableHover>
        {_L.t('advanced_search.timeline.show_weekend')}
      </Menu.Item>
    ) : null

    const menuItemShowCompletedTask = enableOptions.taskCompleted ? (
      <Menu.Item right={showCompletedTaskSwitch} disableHover>
        {_L.t('advanced_search.timeline.show_completed_task')}
      </Menu.Item>
    ) : null

    const menuItemshowTasksWithOutDate = enableOptions.taskWithoutDate ? (
      <Menu.Item right={showTasksWithOutDate} disableHover>
        {_L.t('advanced_search.timeline.show_no_date_task')}
      </Menu.Item>
    ) : null

    return (
      <Menu width={360}>
        {menuItemShowWeekend}
        {menuItemShowCompletedTask}
        {menuItemshowTasksWithOutDate}
        <Menu.Item ax='ax-about-timeline-menu-item' onClick={this.onShowAboutTimelineModal}>
          {_L.t('advanced_search.timeline.about_timeline')}
        </Menu.Item>
      </Menu>
    )
  },

  renderAboutTimelineModal () {
    if (!this.props.showAboutTimelineModal) return null
    return <GanttAboutModal onClose={this.props.onCloseAboutTimelineModal} />
  },

  render () {
    return (
      <div className='tw-gantt-header'>
        <div className='tw-gantt-header__navigator'>
          {this.renderMoreOptions()}
          {this.renderAboutTimelineModal()}
          <div className='tw-gantt-header__today'>
            <Button onClick={this.props.onToday} style='blend-dark'>
              {_L.t('advanced_search.timeline.today')}
            </Button>
          </div>
          <div className='tw-gantt-header__arrow'>
            <Button icon='arrow-left' onClick={this.props.onPrev} style='blend-dark' />
            <Button icon='arrow-right' onClick={this.props.onNext} style='blend-dark' />
          </div>
        </div>
      </div>
    )
  }
})

export default enhance(GanttHeader)



// WEBPACK FOOTER //
// ./src/react/components/v2/gantt/GanttHeader.react.js