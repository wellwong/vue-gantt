import './GanttAboutModal.styl'

import React from 'react'
import Interpolate from 'react-interpolate-component'

import { POSITION_CENTERED, showContactForm } from '../../../../tw-zendesk-integration'
import LegacyModal from '../misc/LegacyModal.react'

const GanttAboutModal = React.createClass({
  propTypes: {
    onClose: React.PropTypes.func.isRequired
  },

  onSendFeedback () {
    showContactForm(POSITION_CENTERED)
    this.props.onClose()
  },

  render () {
    return (
      <LegacyModal
        className='tw-gantt-about-modal ax-about-timeline-modal'
        title={_L.t('advanced_search.timeline.about_timeline')}
        buttons={[]}
        onClose={this.props.onClose}
        style={{ footer: { display: 'none' } }}
        plain
      >
        <div className='tw-gantt-about-modal__info'>
          <Interpolate
            format={_L.t('advanced_search.timeline.about_modal.info')}
            feedback={
              <span
                className='tw-gantt-about-modal__feedback-link ax-about-timeline-contact-link'
                onClick={this.onSendFeedback}
              >
                {_L.t('advanced_search.timeline.about_modal.feedback')}
              </span>
            }
          />
        </div>
        <div className='tw-gantt-about-modal__head'>
          {_L.t('advanced_search.timeline.about_modal.legends')}
        </div>
        <div className='tw-gantt-about-modal__legends'>
          <div className='tw-gantt-about-modal__section'>
            <div>
              <div className='overdue round' style={{ width: '15px', height: '14px' }} />
              <span>{_L.t('advanced_search.timeline.about_modal.legends.overdue')}</span>
            </div>
            <div>
              <div className='planned round' style={{ width: '15px', height: '14px' }} />
              <span>{_L.t('advanced_search.timeline.about_modal.legends.planned')}</span>
            </div>
            <div>
              <div className='completed round' style={{ width: '15px', height: '14px' }} />
              <span>{_L.t('advanced_search.timeline.about_modal.legends.completed')}</span>
            </div>
          </div>
          <div className='tw-gantt-about-modal__section --wide'>
            <div>
              <div>
                <img src={require('./img/no-end-date.svg')} />
              </div>
              <span>{_L.t('advanced_search.timeline.about_modal.legends.task_no_due_date')}</span>
            </div>
            <div>
              <div>
                <img src={require('./img/no-start-date.svg')} />
              </div>
              <span>{_L.t('advanced_search.timeline.about_modal.legends.task_no_start_date')}</span>
            </div>
            <div>
              <div className='today round' style={{ width: '30px', height: '16px', minHeight: '16px', marginRight: '5px' }} />
              <span>{_L.t('advanced_search.timeline.about_modal.legends.today')}</span>
            </div>
          </div>
          <div className='tw-gantt-about-modal__section'>
            <div>
              <div className='project' style={{ width: '30px', position: 'relative' }}>
                <div className='gantt_project_start-indicator' />
                <div className='gantt_project_end-indicator' />
              </div>
              <span>{_L.t('advanced_search.timeline.about_modal.legends.project')}</span>
            </div>
            <div>
              <div className='tasklist' style={{ width: '30px', height: '3px', position: 'relative' }}>
                <div className='gantt_tasklist_start-indicator' />
                <div className='gantt_tasklist_end-indicator' />
              </div>
              <span>{_L.t('advanced_search.timeline.about_modal.legends.tasklist')}</span>
            </div>
          </div>
        </div>
      </LegacyModal>
    )
  }
})

export default GanttAboutModal



// WEBPACK FOOTER //
// ./src/react/components/v2/gantt/GanttAboutModal.react.js