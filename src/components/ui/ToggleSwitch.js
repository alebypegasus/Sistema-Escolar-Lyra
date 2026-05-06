export function ToggleSwitch({ id = 'theme-toggle', onIcon = '', offIcon = '' }) {
  return `
    <div class="theme-switch-wrapper">
      <label class="theme-switch" for="${id}">
        <input type="checkbox" id="${id}" />
        <div class="slider round">
          ${onIcon}
          ${offIcon}
        </div>
      </label>
    </div>
  `;
}
