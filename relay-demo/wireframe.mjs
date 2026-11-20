const screen = document.querySelector('#screen');
const scenario = document.querySelector('#scenario');
let view = 'ticket';
let plan;
let support;

const button = (action, label, primary = false) =>
  `<button type="button" data-action="${action}"${primary ? ' class="primary"' : ''}>${label}</button>`;

const fixture = () => ({
  stale: scenario.value === 'stale',
  assistanceUnknown: scenario.value === 'assistance',
  changed: plan === 'changed',
});

function impact() {
  return fixture().stale
    ? '<h2>Connection status unavailable</h2><p>We can’t confirm whether you’ll make your connection.</p>'
    : '<h2>You’re expected to miss your 10:00 connection</h2><p>Your train is expected at Alder Junction at 10:08. Last checked at 09:40.</p>';
}

const screens = {
  ticket: () => {
    const recorded = [
      plan === 'saved' ? ['saved', 'Saved plan · 10:30 service'] : null,
      ['verified', 'pending', 'failed'].includes(support)
        ? [support, { verified: 'Support case · DEMO-042', pending: 'Checking whether your support request went through', failed: 'Support request failed' }[support]]
        : null,
    ].filter(Boolean);
    return `<h1>Your ticket and journey</h1><article class="notice">${impact()}${button('connection', 'Check your connection', true)}</article>
      <article><h2>Northford to Merewick</h2><p>Demo Advance · 1 adult<br>Ticket reference RLY-DEMO-01</p>
      <p>09:10 Northford → 09:48 Alder Junction, scheduled<br>10:00 Alder Junction → Merewick</p></article>
      ${recorded.length ? `<article><h2>Journey activity</h2>${recorded.map(([state, label]) => button(state, label)).join('')}</article>` : ''}`;
  },
  connection: () => `<h1>Connection at Alder Junction</h1><article class="notice">${impact()}</article>
    <p>Your planned change was 12 minutes. Allow five minutes to change trains in this demo.</p>
    ${fixture().stale ? button('connection', 'Refresh status', true) + button('support', 'Get help') : button('options', 'See travel options', true)}`,
  options: () => {
    const { assistanceUnknown, changed } = fixture();
    return `<h1>Travel options</h1><p>Alder Junction to Merewick</p>
      ${changed ? '<p role="status">The 10:30 option changed. Review the current information below.</p>' : ''}
      <article><h2>10:30 to Merewick</h2>
      <p>${changed ? 'Ticket acceptance is now unknown.' : 'Your demo ticket is accepted under the delay rule.'}</p>
      <p>${assistanceUnknown ? 'We can’t confirm the transfer assistance you need.' : 'No transfer assistance requested.'}</p>
      ${assistanceUnknown || changed ? button('support', 'Get help with the 10:30') : button('review', 'Review 10:30 plan', true)}</article>
      <article><h2>10:45 to Merewick</h2><p>We can’t confirm whether your ticket is accepted.</p>${button('support', 'Get help with the 10:45')}</article>`;
  },
  review: () => `<h1>Review your travel plan</h1><p>10:30 from Alder Junction to Merewick</p>
    <p>Save this as your travel plan. Your ticket stays the same.</p>${button('save', 'Confirm and save plan', true)}${button('options', 'Back to options')}`,
  saved: () => '<h1>Travel plan saved</h1><p>Take the 10:30 from Alder Junction to Merewick. Your existing demo ticket is accepted.</p>',
  support: () => `<h1>Review support request</h1><p>Share your demo booking reference, affected connection and reason for asking for help${fixture().assistanceUnknown ? ', including your transfer assistance need' : ''}.</p>
    ${button('send', 'Confirm and send request', true)}`,
  pending: () => `<h1>Checking your support request</h1><p>We’re checking whether your request went through.</p>${button('reconcile', 'Check request status', true)}`,
  failed: () => `<h1>Support request failed</h1><p>Your support request didn’t go through.</p>${button('support', 'Review and retry request', true)}`,
  verified: () => '<h1>Support request received</h1><p>Your demo case reference is <strong>DEMO-042</strong>.</p>',
};

function render(moveFocus = true) {
  screen.innerHTML = screens[view]() + (view === 'ticket' ? '' : button('ticket', 'View your ticket'));
  if (moveFocus) {
    const heading = screen.querySelector('h1');
    heading.tabIndex = -1;
    heading.focus();
  }
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
  } else {
    view = action === 'support' && ['pending', 'verified'].includes(support) ? support : action;
  }
  render();
});

scenario.addEventListener('change', () => {
  plan = undefined;
  support = undefined;
  view = 'ticket';
  render();
});

render(false);
