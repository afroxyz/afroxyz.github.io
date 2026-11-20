const screen = document.querySelector('#screen');
const scenario = document.querySelector('#scenario');
const ticketJump = document.querySelector('#ticket-jump');
let view = 'ticket';
let plan;
let support;
let supportTopic;

const topics = {
  connection: 'Your 10:00 connection at Alder Junction',
  '1030': 'The 10:30 service from Alder Junction',
  '1045': 'The 10:45 service from Alder Junction',
};

const button = (action, label, primary = false) =>
  `<button type="button" data-action="${action}" class="action${primary ? ' primary' : ''}">${label}${primary ? ' <span aria-hidden="true">→</span>' : ''}</button>`;
const actions = (...buttons) => `<div class="actions">${buttons.join('')}</div>`;
const heading = (section, title, description = '') =>
  `<div class="heading"><p class="kicker">${section}</p><h1 tabindex="-1">${title}</h1>${description ? `<p class="lede">${description}</p>` : ''}</div>`;

function impact(action = '') {
  const unavailable = scenario.value === 'stale';
  return `<article class="panel notice">
    <p class="kicker">${unavailable ? 'Status unavailable' : 'Connection at risk'}</p>
    <h2>${unavailable ? 'We can’t confirm your connection' : 'You’re expected to miss the 10:00 train'}</h2>
    <p>${unavailable ? 'Check again for an update, or ask for help with your onward journey.' : 'Your train is expected to arrive at Alder Junction at 10:08.'}</p>
    <p class="meta">${unavailable ? 'Your booked itinerary is still available.' : 'Last checked at 09:40'}</p>${action}
  </article>`;
}

function ticket() {
  const activity = [];
  if (plan === 'saved') activity.push(button('saved', 'View your 10:30 travel plan'));
  if (support === 'verified') activity.push(button('verified', 'View support case RL-042'));
  if (support === 'pending') activity.push(button('pending', 'Check your support request'));
  if (support === 'failed') activity.push(button('failed', 'Review failed support request'));

  return heading('Journey overview', 'Your ticket and journey', 'Check your connection and what you can do next.')
    + impact(actions(button('connection', 'Check your connection', true)))
    + (activity.length ? `<article class="panel"><h2>Journey activity</h2>${actions(...activity)}</article>` : '');
}

function connection() {
  const stale = scenario.value === 'stale';
  return heading('Connection details', 'Changing at Alder Junction', 'Your original connection to Merewick departs at 10:00.')
    + impact()
    + (stale
      ? actions(button('refresh', 'Refresh status', true), button('support:connection', 'Get help'))
      : `<article class="panel"><h2>Changing trains</h2><p>Your scheduled interchange was 12 minutes. Allow five minutes to change trains at Alder Junction.</p></article>
        ${actions(button('options', 'See travel options', true))}`);
}

function option(time, status, description, action, eligible = false) {
  return `<article class="panel">
    <div class="option-title"><h2><time>${time}</time> to Merewick</h2><span class="tag${eligible ? ' confirmed' : ''}">${status}</span></div>
    <p>${description}</p>${actions(action)}
  </article>`;
}

const screens = {
  ticket,
  connection,
  options: () => {
    const assistanceUnknown = scenario.value === 'assistance';
    const changed = plan === 'changed';
    const eligible = !changed && !assistanceUnknown;
    const acceptance = changed ? 'We can no longer confirm ticket acceptance for this train.' : 'Your ticket is accepted on this train under the delay policy.';
    return heading('Onward travel', 'Travel options', 'Alder Junction to Merewick')
      + (changed ? '<p class="panel notice">The 10:30 option changed while you were reviewing it. Check the updated details below.</p>' : '')
      + option('10:30', changed ? 'Ticket acceptance unknown' : assistanceUnknown ? 'Assistance unconfirmed' : 'Ticket accepted',
        acceptance + (assistanceUnknown ? ' We can’t confirm the transfer assistance you need.' : ''),
        eligible ? button('review', 'Review the 10:30 plan', true) : button('support:1030', 'Get help with the 10:30'), eligible)
      + option('10:45', 'Ticket acceptance unknown', 'We can’t confirm whether you can use your ticket on this train.', button('support:1045', 'Get help with the 10:45'));
  },
  review: () => heading('Confirm your choice', 'Review your travel plan')
    + '<article class="panel"><h2>10:30 to Merewick</h2><p>Departs from Alder Junction. Your existing ticket is accepted.</p><p class="meta">Saving records your plan. Your ticket stays the same.</p></article>'
    + actions(button('save', 'Save travel plan', true), button('options', 'Back to options')),
  saved: () => heading('Journey activity', 'Travel plan saved')
    + '<article class="panel success"><p class="kicker">Your onward journey</p><h2>10:30 to Merewick</h2><p>Depart from Alder Junction. Use your existing ticket.</p></article>',
  support: () => heading('Journey support', 'Review your request')
    + `<article class="panel"><h2>${topics[supportTopic]}</h2><p>Your request includes your booking reference, the affected connection and the service you’re asking about.${scenario.value === 'assistance' ? ' It also includes your transfer assistance need.' : ''}</p></article>`
    + actions(button('send', 'Confirm and send request', true), button(supportTopic === 'connection' ? 'connection' : 'options', 'Go back')),
  pending: () => heading('Journey support', 'Checking your request', 'We’re checking whether your request went through.')
    + actions(button('reconcile', 'Check request status', true)),
  failed: () => heading('Journey support', 'Your request didn’t go through')
    + '<article class="panel notice"><h2>Try again when you’re ready</h2><p>Your journey and ticket are still available.</p></article>'
    + actions(button('retry', 'Review and retry', true)),
  verified: () => heading('Journey support', 'Request received')
    + '<article class="panel success"><p class="kicker">Case reference</p><h2>RL-042</h2><p>You can find this reference again in your journey activity.</p></article>',
};

function render(moveFocus = true) {
  screen.innerHTML = screens[view]();
  ticketJump.hidden = view === 'ticket';
  if (moveFocus) screen.querySelector('h1').focus();
}

screen.addEventListener('click', ({ target }) => {
  const action = target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  if (action === 'save') {
    plan = scenario.value === 'changed' ? 'changed' : 'saved';
    view = plan === 'changed' ? 'options' : 'saved';
  } else if (action === 'send') {
    const firstFailure = scenario.value === 'failure' && support !== 'failed';
    const awaitingVerification = scenario.value === 'pending' && !support;
    support = firstFailure ? 'failed' : awaitingVerification ? 'pending' : 'verified';
    view = support;
  } else if (action === 'reconcile') {
    support = 'verified';
    view = support;
  } else if (action.startsWith('support:')) {
    if (support === 'pending' || support === 'verified') {
      view = support;
    } else {
      supportTopic = action.split(':')[1];
      view = 'support';
    }
  } else if (action === 'refresh') {
    const notice = screen.querySelector('.notice .meta');
    notice.setAttribute('role', 'status');
    notice.textContent = 'Checked again. Connection status is still unavailable.';
    return;
  } else {
    view = action === 'retry' ? 'support' : action;
  }
  render();
});

ticketJump.addEventListener('click', () => {
  view = 'ticket';
  render();
});

scenario.addEventListener('change', () => {
  plan = undefined;
  support = undefined;
  supportTopic = undefined;
  view = 'ticket';
  render();
});

render(false);
