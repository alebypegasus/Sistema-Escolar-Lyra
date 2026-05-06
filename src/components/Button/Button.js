export function Button({ id = '', type = 'button', variant = 'btn-primary', extraClass = '', style = '', attributes = '', icon = '', text = '' }) {
  return `
    <button ${id ? `id="${id}"` : ''} type="${type}" class="${variant} ${extraClass}" style="${style}" ${attributes}>
      ${icon}${icon && text ? ' ' : ''}${text}
    </button>
  `;
}
